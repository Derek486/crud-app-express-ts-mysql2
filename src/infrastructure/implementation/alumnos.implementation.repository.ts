import { AlumnosRepository } from "@infrastructure/repository/alumnos.repository";
import { IAlumnoModel } from "@persistence/models/alumno.model";
import connection from "@persistence/connection";
import { IAlumnoCursoModel } from "@persistence/models/alumnoCurso.model";
import { IAlumnoCreateDto } from "@infrastructure/dto/alumnoCreate.dto";
import { ICursoModel } from "@persistence/models/curso.model";
import { IAlumnoCursoDto } from "@infrastructure/dto/alumnoCurso.dto";

export class AlumnosImplementationRepository extends AlumnosRepository {

  async getAllAlumnos(): Promise<IAlumnoModel[]> {
    const query = 'SELECT id, edad, nombres, apellidos FROM alumnos';
    const [rows] = await connection.promise().query(query);
    return rows as IAlumnoModel[];
  }

  async getAlumnoById(id: number): Promise<IAlumnoModel> {
    const query = `
      SELECT 
        a.id, a.edad, a.nombres, a.apellidos, 
        c.id as curso_id, c.nombre as curso_nombre, c.descripcion as curso_descripcion,
        ac.fecha_inscripcion as fecha_inscripcion
      FROM 
        alumnos a
        LEFT JOIN alumnos_cursos ac ON a.id = ac.alumno_id
        LEFT JOIN cursos c ON ac.curso_id = c.id
      WHERE 
        a.id = ?
    `;
    
    const [rows] = (await connection.promise().query(query, [id])) as any[];
    
    if (!rows || rows.length === 0) {
      throw new Error(`Alumno con ID ${id} no encontrado`);
    }
    
    const alumno: IAlumnoModel = {
      id: rows[0].id,
      edad: rows[0].edad,
      nombres: rows[0].nombres,
      apellidos: rows[0].apellidos,
      cursos: (rows.map((row: any) => ({
        id: row.curso_id,
        nombre: row.curso_nombre,
        descripcion: row.curso_descripcion,
        fechaInscripcion: row.fecha_inscripcion
      } as IAlumnoCursoDto))).filter((row: IAlumnoCursoDto) => !!row.id)
    };
    
    return alumno;
  }

  async storeAlumno(alumno: IAlumnoCreateDto): Promise<IAlumnoModel> {
    try {
      await connection.promise().beginTransaction();

      const [result] = await connection.promise().execute(
        'INSERT INTO alumnos (nombres, apellidos, edad) VALUES (?, ?, ?)',
        [alumno.nombres, alumno.apellidos, alumno.edad]
      );

      const alumnoModel: IAlumnoModel = {
        id: (result as any)?.insertId,
        edad: (result as any)?.edad,
        apellidos: (result as any)?.apellidos,
        nombres: (result as any)?.nombres,
        cursos: []
      }

      if (alumno.cursos && alumno.cursos.length > 0) {
        const fechaInscripcion = new Date();

        const alumnoCursos: IAlumnoCursoModel[] = alumno.cursos.map((cursoId) => ({
          alumnoId: alumnoModel.id,
          cursoId,
          fechaInscripcion,
        }));

        for (const alumnoCurso of alumnoCursos) {
          await connection.promise().execute(
            'INSERT INTO alumnos_cursos (alumno_id, curso_id, fecha_inscripcion) VALUES (?, ?, ?)',
            [alumnoCurso.alumnoId, alumnoCurso.cursoId, alumnoCurso.fechaInscripcion]
          );

          const [result] = await connection.promise().query(
            'SELECT id, nombre, descripcion FROM cursos WHERE id = ?',
            [alumnoCurso.cursoId]
          )

          const cursoModel: IAlumnoCursoDto = {
            id: (result as ICursoModel[])[0].id,
            nombre: (result as ICursoModel[])[0].nombre,
            descripcion: (result as ICursoModel[])[0].descripcion,
            fechaInscripcion: alumnoCurso.fechaInscripcion
          }

          alumnoModel.cursos?.push(cursoModel)
        }
      }

      await connection.promise().commit();
      return alumnoModel;
    } catch (error) {
      await connection.promise().rollback();
      throw error
    }
  }

  async deleteAlumno(id: number): Promise<boolean> {
    try {
      const [result] = await connection.promise().execute(
        'DELETE FROM alumnos WHERE id = ?',
        [id]
      );
      return (result as any).affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  async updateAlumno(alumno: IAlumnoCreateDto): Promise<IAlumnoModel> {
    try {
      if (alumno.id) {
        await connection.promise().beginTransaction();

        await connection.promise().execute(
          'UPDATE alumnos SET nombres = ?, apellidos = ?, edad = ? WHERE id = ?',
          [alumno.nombres, alumno.apellidos, alumno.edad, alumno.id!]
        );

        const updatedAlumno: IAlumnoModel = {
          id: alumno.id!,
          nombres: alumno.nombres,
          apellidos: alumno.apellidos,
          edad: alumno.edad,
          cursos: []
        };

        const [result] = await connection.promise().query(
          'SELECT curso_id, alumno_id, fecha_inscripcion FROM alumnos_cursos WHERE alumno_id = ?',
          [updatedAlumno.id]
        );

        const resultCursos = (result as any[]).map(c => ({
          cursoId: c.curso_id,
          alumnoId: c.alumno_id,
          fechaInscripcion: c.fecha_inscripcion
        } as IAlumnoCursoModel))

        const cursosDelete = resultCursos
          .filter(ac => !alumno.cursos.some((c) => c == ac.cursoId))
          .map(ac => ac.cursoId)

        const cursosInsert = alumno.cursos ? alumno.cursos
          .filter(ac => !resultCursos.some((c) => c.cursoId == ac)) : []

        if (cursosDelete.length > 0) {
          await connection.promise().execute(
            `DELETE FROM alumnos_cursos WHERE alumno_id = ? AND curso_id IN (?)`,
            [updatedAlumno.id, cursosDelete.join(', ')]
          )
        }

        if (cursosInsert.length > 0) {
          const fechaInscripcion = new Date();

          const alumnoCursos: IAlumnoCursoModel[] = cursosInsert.map((cursoId) => ({
            alumnoId: updatedAlumno.id,
            cursoId,
            fechaInscripcion,
          }));

          for (const alumnoCurso of alumnoCursos) {
            await connection.promise().execute(
              'INSERT INTO alumnos_cursos (alumno_id, curso_id, fecha_inscripcion) VALUES (?, ?, ?)',
              [alumnoCurso.alumnoId, alumnoCurso.cursoId, alumnoCurso.fechaInscripcion]
            );
          }
        }

        const [cursos] = await connection.promise().query(
          `SELECT c.id, c.nombre, c.descripcion, ac.fecha_inscripcion as fecha_inscripcion
           FROM cursos c
           INNER JOIN alumnos_cursos ac ON ac.curso_id = c.id
           WHERE c.id IN (
            SELECT curso_id 
            FROM alumnos_cursos
	          WHERE alumno_id = ?
           )`,
          [updatedAlumno.id]
        )

        const cursoModel: IAlumnoCursoDto[] = (cursos as any[]).map(C => ({
          id: C.id,
          nombre: C.nombre,
          descripcion: C.descripcion,
          fechaInscripcion: C.fecha_inscripcion
        } as IAlumnoCursoDto))

        updatedAlumno.cursos = cursoModel

        await connection.promise().commit();
        return updatedAlumno;
      }
      return {} as IAlumnoModel
    } catch (error) {
      console.log(error);
      await connection.promise().rollback();
      throw error;
    }
  }

}