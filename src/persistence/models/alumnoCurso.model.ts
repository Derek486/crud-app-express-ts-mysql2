import { IAlumnoModel } from "./alumno.model"
import { ICursoModel } from "./curso.model"

export interface IAlumnoCursoModel {
  id?: number
  alumnoId: number
  cursoId: number
  fechaInscripcion: Date

  alumno?: IAlumnoModel
  curso?: ICursoModel
}