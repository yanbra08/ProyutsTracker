const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const proyectoController = require('../controllers/proyectoController');

// Asegurar que la carpeta 'uploads' exista en la raíz del backend
const dir = './uploads';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

// Configurar el almacenamiento de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Guardamos el archivo con la fecha actual + nombre original para evitar duplicados
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Rutas vinculadas al controlador (Agregamos el middleware 'upload.single')
router.post('/guardar', upload.single('archivo'), proyectoController.guardarProyecto);
router.get('/listar/:usuario_id', proyectoController.listarProyectos);
router.delete('/eliminar/:id', proyectoController.eliminarProyecto);

module.exports = router;