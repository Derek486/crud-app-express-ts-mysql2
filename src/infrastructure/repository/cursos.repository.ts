import { ICursoCreateDto } from "@infrastructure/dto/cursoCreate.dto";
import { ICursoModel } from "@persistence/models/curso.model";

export abstract class CursosRepository {
  abstract getAllCursos(): Promise<ICursoModel[]>
  abstract getCursoById(id: number): Promise<ICursoModel>
  abstract storeCurso(curso: ICursoCreateDto): Promise<ICursoModel>
  abstract deleteCurso(id: number): Promise<boolean>
  abstract updateCurso(curso: ICursoCreateDto): Promise<ICursoModel>
}