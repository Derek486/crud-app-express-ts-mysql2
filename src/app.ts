import express from 'express'
import path from 'path'
import { APP_HOST, APP_PORT } from './config'
import alumnosRoutes from './routes/alumnos.routes'
import cursosRoutes from './routes/cursos.routes'

const app = express()

app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, './views'))

app.set('PORT', APP_PORT)
app.set('HOST', APP_HOST)

app.get('/', (_, res) => res.redirect('/alumnos'))
app.use('/alumnos', alumnosRoutes)
app.use('/cursos', cursosRoutes)

export default app