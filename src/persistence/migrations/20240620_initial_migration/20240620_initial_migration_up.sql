CREATE TABLE IF NOT EXISTS alumnos (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  edad      INT,
  nombres   VARCHAR(255),
  apellidos VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS cursos (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(255),
  descripcion VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS alumnos_cursos (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  alumno_id   INT,
  curso_id    INT,
  fecha_inscripcion DATE,
  CONSTRAINT fk_alumno_id FOREIGN KEY (alumno_id) REFERENCES alumnos(id),
  CONSTRAINT fk_curso_id FOREIGN KEY (curso_id) REFERENCES cursos(id)
);
