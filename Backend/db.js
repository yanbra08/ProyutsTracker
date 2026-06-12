const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: false // Obligatorio para que Render te deje conectar externamente
  }
});

pool.on('connect', () => {
  console.log('¡Conectado exitosamente a la base de datos PostgreSQL!');
});

module.exports = pool;
