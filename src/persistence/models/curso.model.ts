import { IAlumnoCursoDto } from "@infrastructure/dto/alumnoCurso.dto";

export interface ICursoModel {
  id: number,
  nombre: string,
  descripcion: string,

  alumnos?: IAlumnoCursoDto[]
}