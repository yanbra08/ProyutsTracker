const { Pool } = require('pg');

// Usamos directamente la cadena de conexión externa (External Database URL) como respaldo absoluto
const connectionString = process.env.DATABASE_URL || 'postgresql://proyuts_tracker_user:3dj7UEAgolt9pcWWNqFqGw7Q21LcR7Uq@dpg-d815bk67r5hc7391gnvg-a.oregon-postgres.render.com/proyuts_tracker';

const pool = new Pool({
  connectionString: connectionString,
  // Si la URL contiene localhost (en tu PC), apaga SSL. Si está en Render (la nube), lo activa obligatoriamente.
  ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false }
});

pool.on('connect', () => {
  console.log('¡Conectado exitosamente a la base de datos PostgreSQL en la nube!');
});

module.exports = pool;