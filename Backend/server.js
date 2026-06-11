const express = require('express');
const cors = require('cors');
const path = require('path'); // ← Asegúrate de que esta línea esté
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 📁 Hacer que la carpeta 'uploads' sea accesible públicamente desde el navegador
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Importar y usar rutas
const authRoutes = require('./src/routes/authRoutes');
const proyectoRoutes = require('./src/routes/proyectoRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/proyectos', proyectoRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`);
});