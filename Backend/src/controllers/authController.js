const pool = require('../../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 1. LÓGICA DE REGISTRO
exports.registrarUsuario = async (req, res) => {
    const { nombre, correo, contrasena, semestre_id } = req.body;
    try {
        // Verificar si el correo ya existe en PostgreSQL
        const usuarioExiste = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
        if (usuarioExiste.rows.length > 0) {
            return res.status(400).json({ success: false, mensaje: 'El correo ya está registrado.' });
        }

        // Encriptar contraseña por seguridad
        const salt = await bcrypt.genSalt(10);
        const contrasenaEncriptada = await bcrypt.hash(contrasena, salt);

        // Guardar en la base de datos relacional vinculándolo a su semestre
        const nuevoUsuario = await pool.query(
            'INSERT INTO usuarios (nombre, correo, contrasena, semestre_id) VALUES ($1, $2, $3, $4) RETURNING id, nombre, correo',
            [nombre, correo, contrasenaEncriptada, semestre_id]
        );

        res.status(201).json({ success: true, mensaje: '¡Usuario registrado con éxito!', usuario: nuevoUsuario.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, mensaje: 'Error en el servidor al registrar.' });
    }
};

// 2. LÓGICA DE LOGIN
exports.iniciarSesion = async (req, res) => {
    const { correo, contrasena } = req.body;
    try {
        // Buscar el usuario por su correo
        const resultado = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
        if (resultado.rows.length === 0) {
            return res.status(400).json({ success: false, mensaje: 'El correo no existe.' });
        }

        const usuario = resultado.rows[0];

        // Comparar la contraseña escrita con la encriptada en la BD
        const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!contrasenaValida) {
            return res.status(400).json({ success: false, mensaje: 'Contraseña incorrecta.' });
        }

        // Crear el token JWT (Cumpliendo el requisito de seguridad)
        const token = jwt.sign(
            { id: usuario.id, nombre: usuario.nombre },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.json({
            success: true,
            mensaje: '¡Inicio de sesión exitoso!',
            token,
            usuario: { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, mensaje: 'Error en el servidor al iniciar sesión.' });
    }
};