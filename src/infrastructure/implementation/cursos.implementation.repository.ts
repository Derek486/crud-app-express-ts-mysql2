import { CursosRepository } from "@infrastructure/repository/cursos.repository";
import { ICursoModel } from "@persistence/models/curso.model";
import { ICursoCreateDto } from "@infrastructure/dto/cursoCreate.dto";
import connection from "@persistence/connection";

export class CursosImplementationRepository extends CursosRepository {

  async getAllCursos(): Promise<ICursoModel[]> {
    const query = 'SELECT id, nombre, descripcion FROM cursos';
    const [rows] = await connection.promise().query(query);
    return rows as ICursoModel[];
  }

  async getCursoById(id: number): Promise<ICursoModel> {
    const query = `
      SELECT c.id, c.nombre, c.descripcion,
             a.id as alumno_id, a.edad, a.nombres, a.apellidos,
             ac.fecha_inscripcion
      FROM cursos c
      LEFT JOIN alumnos_cursos ac ON c.id = ac.curso_id
      LEFT JOIN alumnos a ON ac.alumno_id = a.id
      WHERE c.id = ?
    `;
    
    const [rows] = await connection.promise().query(query, [id]);
  
    if ((rows as any[]).length === 0) {
      throw new Error(`No se encontró el curso de ID ${id}`)
    }
  
    const curso: ICursoModel = {
      id: (rows as any[])[0].id,
      nombre: (rows as any[])[0].nombre,
      descripcion: (rows as any[])[0].descripcion,
      alumnos: []
    };
  
    (rows as any[]).forEach(row => {
      if (row.alumno_id) {
        curso.alumnos?.push({
          id: row.alumno_id,
          edad: row.edad,
          nombres: row.nombres,
          apellidos: row.apellidos,
          fechaInscripcion: row.fecha_inscripcion
        });
      }
    });
  
    return curso;
  }
  async storeCurso(curso: ICursoCreateDto): Promise<ICursoModel> {
    try {
      const query = 'INSERT INTO cursos (nombre, descripcion) VALUES (?, ?)';
      const [result] = await connection.promise().execute(query, [curso.nombre, curso.descripcion]);

      const newCurso: ICursoModel = {
        id: (result as any).insertId,
        nombre: curso.nombre,
        descripcion: curso.descripcion,
      };

      return newCurso;
    } catch (error) {
      throw error;
    }
  }

  async deleteCurso(id: number): Promise<boolean> {
    try {
      const query = 'DELETE FROM cursos WHERE id = ?';
      const [result] = await connection.promise().execute(query, [id]);
      return (result as any).affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  async updateCurso(curso: ICursoCreateDto): Promise<ICursoModel> {
    try {
      if (curso.id) {
        const query = 'UPDATE cursos SET nombre = ?, descripcion = ? WHERE id = ?';
        await connection.promise().execute(query, [curso.nombre, curso.descripcion, curso.id]);
        const updatedCurso: ICursoModel = {
          id: curso.id,
          nombre: curso.nombre,
          descripcion: curso.descripcion,
        };
        return updatedCurso;
      }
      return {} as ICursoModel
    } catch (error) {
      throw error;
    }
  }
}
