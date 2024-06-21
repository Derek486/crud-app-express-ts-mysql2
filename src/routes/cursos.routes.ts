import { Router } from 'express';
import cursosController from '@http/controllers/cursos.controller';
import { validateCursoCreate } from '@http/middlewares/validator.middleware';

const routes = Router();

routes.get('/', cursosController.index);
routes.get('/create', cursosController.create);
routes.get('/:id', cursosController.edit);
routes.post('/create', validateCursoCreate, cursosController.store);
routes.post('/update', validateCursoCreate, cursosController.editPost);
routes.post('/delete/:id', cursosController.destroy);

export default routes;
