import { Router } from "express";
import alumnosController from '@http/controllers/alumnos.controller'
import { validateAlumnoCreate } from "@http/middlewares/validator.middleware";

const routes = Router()

routes.get('/', alumnosController.index)
routes.get('/create', alumnosController.create)
routes.get('/:id', alumnosController.edit)
routes.post('/create', validateAlumnoCreate, alumnosController.store)
routes.post('/update', validateAlumnoCreate, alumnosController.editPost)
routes.post('/delete/:id', alumnosController.destroy)

export default routes