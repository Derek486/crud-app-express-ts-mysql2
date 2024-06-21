import mysql2 from 'mysql2'
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from '../config'

const connection = mysql2.createConnection({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME
})

export default connection