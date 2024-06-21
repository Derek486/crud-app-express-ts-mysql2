import app from './app';
import connection from '@persistence/connection';

async function main() {
  try {
    await connection.promise().connect();
    
    console.log('Conexión a base de datos exitosa ', connection.threadId);

    const PORT = app.get('PORT');
    const HOST = app.get('HOST');

    const server = app.listen(PORT, HOST, () => {
      console.log(`Servidor Express escuchando en http://${HOST}:${PORT}`);
    });

    const closeConnection = async () => {
      try {
        await connection.promise().end();
        console.log('Conexión a base de datos cerrada');
      } catch (err) {
        console.error('Error al cerrar la conexión a la base de datos: ', err);
      } finally {
        process.exit();
      }
    };

    process.on('SIGINT', closeConnection);
    process.on('SIGTERM', closeConnection);
    server.on('close', closeConnection);

  } catch (err) {
    console.error('Error de conexión en base de datos: ', err);
  }
}

main()
