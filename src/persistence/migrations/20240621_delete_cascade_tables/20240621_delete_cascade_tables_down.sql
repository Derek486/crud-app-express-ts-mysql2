ALTER TABLE alumnos_cursos
    DROP FOREIGN KEY fk_alumno_id,
    DROP FOREIGN KEY fk_curso_id;

ALTER TABLE alumnos_cursos
    ADD CONSTRAINT fk_alumno_id
    FOREIGN KEY (alumno_id) REFERENCES alumnos(id),
    ADD CONSTRAINT fk_curso_id
    FOREIGN KEY (curso_id) REFERENCES cursos(id);
