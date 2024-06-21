import { IAlumnoCreateDto } from '@infrastructure/dto/alumnoCreate.dto';
import { ICursoCreateDto } from '@infrastructure/dto/cursoCreate.dto';
import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

export const validateAlumnoCreate = [
  body('edad')
    .isInt({ min: 1 })
    .withMessage('Ingrese una edad válida'),
  body('nombres')
    .isString()
    .notEmpty()
    .withMessage('Este campo es requerido'),
  body('apellidos')
    .isString()
    .notEmpty()
    .withMessage('Este campo es requerido'),
  body('cursos')
    .optional(),
  (req: Request<IAlumnoCreateDto>, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    next();
  }
];

export const validateCursoCreate = [
  body('nombre')
    .isString()
    .notEmpty()
    .withMessage('Este campo es requerido'),
  body('descripcion')
    .isString(),
  (req: Request<ICursoCreateDto>, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    next();
  }
];
