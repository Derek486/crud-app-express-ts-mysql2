import { IAlumnoCreateDto } from '@infrastructure/dto/alumnoCreate.dto';
import { AlumnosImplementationRepository } from '@infrastructure/implementation/alumnos.implementation.repository';
import { CursosImplementationRepository } from '@infrastructure/implementation/cursos.implementation.repository';
import { Request, Response, RequestHandler } from 'express';

const alumnosRepository = new AlumnosImplementationRepository()
const cursosRepository = new CursosImplementationRepository()

/**
 * Retorna el listado general de los alumnos
 * 
 * @param req Request
 * @param res Response
 */
const index: RequestHandler = async (_: Request, res: Response) => {
  try {
    const alumnos = await alumnosRepository.getAllAlumnos()
    res.render('alumnos/listadoAlumnos', { alumnos })
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener alumnos', error });
  }
};

/**
 * Retorna el modelo de alumno buscado por id
 * 
 * @param req Request<{ id: number }>
 * @param res Response
 */
const edit: RequestHandler<{ id: number }> = async (req: Request<{ id: number }>, res: Response) => {
  try {
    const alumno = await alumnosRepository.getAlumnoById(req.params.id)
    const cursos = await cursosRepository.getAllCursos()
    res.render('alumnos/formularioAlumno', { alumno, cursos })
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener alumno', error });
  }
}

/**
 * Retorna al formulario de creación de alumno
 * 
 * @param req Request
 * @param res Response
 */
const create: RequestHandler = async (_, res: Response) => {
  try {
    const cursos = await cursosRepository.getAllCursos()
    res.render('alumnos/formularioAlumno', { cursos })
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener cursos', error });
  }
}

/**
 * Almacena el registro en la base de datos y redirecciona al index
 * 
 * @param req Request<IAlumnoCreateDto>
 * @param res Response
 */
const store: RequestHandler<IAlumnoCreateDto> = async (req: Request<IAlumnoCreateDto>, res: Response) => {
  try {
    await alumnosRepository.storeAlumno(req.body)
    res.redirect('/alumnos')
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener alumno', error });
  }
}

/**
 * Actualiza el registro de alumno y redirecciona al index
 * 
 * @param req Request<IAlumnoCreateDto>
 * @param res Response
 */
const editPost: RequestHandler<IAlumnoCreateDto> = async (req: Request<IAlumnoCreateDto>, res: Response) => {
  try {
    await alumnosRepository.updateAlumno(req.body)
    res.redirect('/alumnos')
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar alumno', error });
  }
}

/**
 * Almacena el registro en la base de datos y redirecciona al index
 * 
 * @param req Request<{ id: number }>
 * @param res Response
 */
const destroy: RequestHandler<{ id: number }> = async (req: Request<{ id: number }>, res: Response) => {
  try {
    await alumnosRepository.deleteAlumno(req.params.id)
    res.redirect('/alumnos')
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar alumno', error });
  }
}

export default {
  index,
  edit,
  editPost,
  create,
  store,
  destroy,
};
