const { Pool } = require('pg');
require('dotenv').config();

// Creamos la conexión con la base de datos usando las variables del .env
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  // ESTO ES LO QUE FALTA: Obliga a Render a usar conexión SSL segura, pero en tu PC (localhost) lo ignora
  ssl: process.env.DB_HOST !== 'localhost' ? { rejectUnauthorized: false } : false
});

// Este mensaje nos avisará en la terminal si la conexión fue exitosa
pool.on('connect', () => {
  console.log('¡Conectado exitosamente a la base de datos PostgreSQL!');
});

module.exports = pool;