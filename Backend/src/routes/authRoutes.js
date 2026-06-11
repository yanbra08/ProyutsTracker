const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Definimos las URLs para registrarse e iniciar sesión
router.post('/register', authController.registrarUsuario);
router.post('/login', authController.iniciarSesion);

module.exports = router;