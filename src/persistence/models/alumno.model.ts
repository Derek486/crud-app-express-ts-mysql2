import { IAlumnoCursoDto } from "@infrastructure/dto/alumnoCurso.dto";

export interface IAlumnoModel {
  id: number;
  edad: number;
  nombres: string;
  apellidos: string;

  cursos?: IAlumnoCursoDto[]
}