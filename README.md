# CRUD App con Express, TypeScript y MySQL

## Descripción
Esta es una aplicación CRUD desarrollada con Express y TypeScript que permite gestionar estudiantes, cursos y matrículas. Utiliza MySQL2 como cliente para la base de datos y las migraciones se ejecutan manualmente.

## Tecnologías Utilizadas
- Node.js
- Express
- TypeScript
- MySQL2
- dotenv
- Pug (para renderizado de vistas)

## Instalación
1. Clona el repositorio:
   ```sh
   git clone https://github.com/Derek486/crud-app-express-ts-mysql2.git
   ```
2. Accede al directorio del proyecto:
   ```sh
   cd crud-app-express-ts-mysql2
   ```
3. Instala las dependencias:
   ```sh
   npm install
   ```
4. Configura el archivo `.env` con las credenciales de la base de datos:
   ```env
   DB_HOST='localhost'
   DB_PORT=3306
   DB_USER='tu_usuario'
   DB_PASSWORD='tu_contraseña'
   DB_NAME='crud_express_ts_mysql2'
   ```
5. Ejecuta manualmente las migraciones en MySQL.

## Estructura del Proyecto
```
crud-app-express-ts-mysql2/
│── node_modules/
│── src/
│   ├── http/
│   │   ├── controllers/
│   │   ├── middlewares/
│   ├── infrastructure/
│   │   ├── dto/
│   │   ├── implementation/
│   │   ├── repository/
│   ├── persistence/
│   │   ├── migrations/
│   │   ├── models/
│   │   ├── connection.ts
│   ├── routes/
│   ├── views/
│   ├── app.ts
│   ├── config.ts
│   ├── index.ts
│── .env
│── .gitignore
│── package-lock.json
│── package.json
│── tsconfig.json
```

## Uso
1. Inicia el servidor:
   ```sh
   npm run dev
   ```
2. La API estará disponible en `http://localhost:3000`.

## Endpoints Principales
### Estudiantes
- `GET /alumnos` - Obtener todos los alumnos.
- `GET /alumnos/create` - Formulario para crear un alumno.
- `GET /alumnos/:id` - Obtener datos de un alumno.
- `POST /alumnos/create` - Crear un nuevo alumno.
- `POST /alumnos/update` - Actualizar un alumno.
- `POST /alumnos/delete/:id` - Eliminar un alumno.

### Cursos
- `GET /cursos` - Obtener todos los cursos.
- `GET /cursos/create` - Formulario para crear un curso.
- `GET /cursos/:id` - Obtener datos de un curso.
- `POST /cursos/create` - Crear un nuevo curso.
- `POST /cursos/update` - Actualizar un curso.
- `POST /cursos/delete/:id` - Eliminar un curso.

## Contribución
Si deseas contribuir a este proyecto, por favor realiza un fork del repositorio y crea un pull request con tus mejoras.

## Licencia
Este proyecto está bajo la licencia MIT.

