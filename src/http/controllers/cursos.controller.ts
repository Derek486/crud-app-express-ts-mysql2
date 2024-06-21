import { Request, Response, RequestHandler } from 'express';
import { ICursoCreateDto } from '@infrastructure/dto/cursoCreate.dto';
import { CursosImplementationRepository } from '@infrastructure/implementation/cursos.implementation.repository';

const cursosRepository = new CursosImplementationRepository();

/**
 * Retorna el listado general de los cursos
 * 
 * @param req Request
 * @param res Response
 */
const index: RequestHandler = async (_: Request, res: Response) => {
  try {
    const cursos = await cursosRepository.getAllCursos();
    res.render('cursos/listadoCursos', { cursos });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener cursos', error });
  }
};

/**
 * Retorna el modelo de curso buscado por id
 * 
 * @param req Request<{ id: number }>
 * @param res Response
 */
const edit: RequestHandler<{ id: number }> = async (req: Request<{ id: number }>, res: Response) => {
  try {
    const curso = await cursosRepository.getCursoById(req.params.id);
    res.render('cursos/formularioCurso', { curso });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener curso', error });
  }
};

/**
 * Retorna al formulario de creación de curso
 * 
 * @param req Request
 * @param res Response
 */
const create: RequestHandler = async (_, res: Response) => {
  try {
    res.render('cursos/formularioCurso');
  } catch (error) {
    res.status(500).json({ message: 'Error al mostrar formulario de curso', error });
  }
};

/**
 * Almacena el registro en la base de datos y redirecciona al index
 * 
 * @param req Request<ICursoCreateDto>
 * @param res Response
 */
const store: RequestHandler<ICursoCreateDto> = async (req: Request<ICursoCreateDto>, res: Response) => {
  try {
    await cursosRepository.storeCurso(req.body);
    res.redirect('/cursos');
  } catch (error) {
    res.status(500).json({ message: 'Error al almacenar curso', error });
  }
};

/**
 * Actualiza el registro de curso y redirecciona al index
 * 
 * @param req Request<ICursoCreateDto>
 * @param res Response
 */
const editPost: RequestHandler<ICursoCreateDto> = async (req: Request<ICursoCreateDto>, res: Response) => {
  try {
    await cursosRepository.updateCurso(req.body);
    res.redirect('/cursos');
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar curso', error });
  }
};

/**
 * Elimina el registro de curso y redirecciona al index
 * 
 * @param req Request<{ id: number }>
 * @param res Response
 */
const destroy: RequestHandler<{ id: number }> = async (req: Request<{ id: number }>, res: Response) => {
  try {
    await cursosRepository.deleteCurso(req.params.id);
    res.redirect('/cursos');
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar curso', error });
  }
};

export default {
  index,
  edit,
  editPost,
  create,
  store,
  destroy,
};
