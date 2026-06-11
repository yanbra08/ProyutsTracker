const pool = require('../../db');

// 1. GUARDAR UN NUEVO PROYECTO (CON ARCHIVO REAL)
exports.guardarProyecto = async (req, res) => {
    const { titulo, usuario_id, semestre_id } = req.body;
    
    // Si no se subió ningún archivo, enviamos un error
    if (!req.file) {
        return res.status(400).json({ success: false, mensaje: 'Debes adjuntar un archivo para el proyecto.' });
    }

    // Guardamos la ruta o el nombre del archivo en la columna url_proyecto
    const url_proyecto = `/uploads/${req.file.filename}`;

    try {
        const nuevoProyecto = await pool.query(
            'INSERT INTO proyectos (titulo, descripcion, url_proyecto, usuario_id, semestre_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [titulo, 'Proyecto académico cargado al sistema.', url_proyecto, usuario_id, semestre_id]
        );
        res.status(201).json({ success: true, mensaje: '¡Proyecto guardado con éxito!', proyecto: nuevoProyecto.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, mensaje: 'Error al guardar el proyecto en PostgreSQL.' });
    }
};

// 2. LISTAR PROYECTOS DE UN USUARIO
exports.listarProyectos = async (req, res) => {
    const { usuario_id } = req.params;
    try {
        const proyectos = await pool.query(
            'SELECT * FROM proyectos WHERE usuario_id = $1 ORDER BY fecha_creacion DESC',
            [usuario_id]
        );
        res.json({ success: true, proyectos: proyectos.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, mensaje: 'Error al obtener los proyectos.' });
    }
};

// 3. ELIMINAR UN PROYECTO
exports.eliminarProyecto = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM proyectos WHERE id = $1', [id]);
        res.json({ success: true, mensaje: 'Proyecto eliminado correctamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, mensaje: 'Error al eliminar el proyecto.' });
    }
};