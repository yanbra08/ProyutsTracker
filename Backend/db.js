const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const pool = new Pool({
  user: process.env.DB_USER || 'proyuts_tracker_user',
  password: process.env.DB_PASSWORD || '3dj7UEAgolt9pcWWNqFqGw7Q21LcR7Uq',
  host: process.env.DB_HOST || 'dpg-d815bk67r5hc739lgnvg-a',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'proyuts_tracker',
  // Si el host no es localhost, activa SSL obligatoriamente para Render
  ssl: (process.env.DB_HOST || 'dpg-d8l5bk67r5hc739lgnvg-a') !== 'localhost' 
    ? { rejectUnauthorized: false } 
    : false
});

pool.on('connect', () => {
  console.log('¡Conectado exitosamente a la base de datos PostgreSQL!');
});

module.exports = pool;