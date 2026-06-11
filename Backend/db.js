const { Pool } = require('pg');

// Cadena de conexión externa directa a tu base de datos de Render
const connectionString = process.env.DATABASE_URL || 'postgresql://proyuts_tracker_user:3dj7UEAgolt9pcWWNqFqGw7Q21LcR7Uq@dpg-d815bk67r5hc7391gnvg-a.oregon-postgres.render.com/proyuts_tracker';

const pool = new Pool({
  connectionString: connectionString,
  // Si estás en tu PC (localhost) apaga SSL, en Render lo activa automáticamente
  ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false }
});

pool.on('connect', () => {
  console.log('¡Conectado exitosamente a la base de datos PostgreSQL en la nube!');
});

module.exports = pool;