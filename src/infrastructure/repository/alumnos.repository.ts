import { IAlumnoCreateDto } from "@infrastructure/dto/alumnoCreate.dto";
import { IAlumnoModel } from "@persistence/models/alumno.model";

export abstract class AlumnosRepository {
  abstract getAllAlumnos(): Promise<IAlumnoModel[]>
  abstract getAlumnoById(id: number): Promise<IAlumnoModel>
  abstract storeAlumno(alumno: IAlumnoCreateDto): Promise<IAlumnoModel>
  abstract deleteAlumno(id: number): Promise<boolean>
  abstract updateAlumno(alumno: IAlumnoCreateDto): Promise<IAlumnoModel>
}