// CORRECCIÓN: Agregado el './' relativo para que el navegador resuelva el módulo correctamente
import { API_URL } from './config.js'; 

// Elementos del DOM
const welcomeText = document.getElementById('texto-bienvenida');
const btnSalir = document.getElementById('btn-salir');
const formProyecto = document.getElementById('form-nuevo-proyecto');
const btnSubmit = document.getElementById('btn-submit-proyecto');
const btnTheme = document.getElementById('btn-theme');

const valCompletados = document.getElementById('val-completados');
const valRestantes = document.getElementById('val-restantes');
const valPorcentaje = document.getElementById('val-porcentaje');
const barraProgreso = document.getElementById('barra-progreso');
const listaProyectosContainer = document.getElementById('lista-proyectos-container');

// Obtener datos del usuario desde la sesión de tu backend
const usuarioActual = JSON.parse(localStorage.getItem('usuario'));
const tokenSesion = localStorage.getItem('token');
const TOTAL_REQUERIDO = 52;

// --- 1. MODO OSCURO ---
const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (btnTheme) {
        const icon = btnTheme.querySelector('i');
        if (icon) icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
};
applyTheme(localStorage.getItem('theme') || 'light');

if (btnTheme) {
    btnTheme.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        applyTheme(current === 'dark' ? 'light' : 'dark');
    });
}

// --- 2. CONTROL DE SESIÓN ---
if (usuarioActual && tokenSesion) {
    if (welcomeText) welcomeText.textContent = `¡Bienvenido, ${usuarioActual.nombre}! 👋`;
    cargarProyectos();
} else {
    window.location.href = "../Login/Login.html";
}

// --- 3. CARGAR PROYECTOS DESDE NODE.JS / POSTGRESQL ---
async function cargarProyectos() {
    if (!usuarioActual || !listaProyectosContainer) return;
    try {
        const respuesta = await fetch(`${API_URL}/proyectos/listar/${usuarioActual.id}`, {
            headers: {
                'Authorization': `Bearer ${tokenSesion}`
            }
        });
        const datos = await respuesta.json();

        if (datos.success) {
            listaProyectosContainer.innerHTML = ''; 
            const contador = datos.proyectos.length;

            if (contador === 0) {
                listaProyectosContainer.innerHTML = '<div class="empty-state">No hay proyectos registrados.</div>';
            } else {
                datos.proyectos.forEach((proy) => {
                    const div = document.createElement('div');
                    div.className = "card";
                    div.style = "margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; padding: 12px;";
                    
                    const urlCompletaArchivo = `${API_URL.replace('/api', '')}${proy.url_proyecto}`;
                    const fechaLindo = new Date(proy.fecha_creacion).toLocaleDateString();

                    div.innerHTML = `
                        <div>
                            <strong>${proy.titulo}</strong><br>
                            <small style="color: var(--text-muted);">${fechaLindo}</small>
                        </div>
                        <div style="display: flex; gap: 15px; align-items: center;">
                            <a href="${urlCompletaArchivo}" target="_blank" style="color: var(--primary-blue);"><i class="fa-solid fa-file-arrow-down"></i></a>
                            <i class="fa-solid fa-trash-can btn-borrar" data-id="${proy.id}" style="color: #ef4444; cursor: pointer;"></i>
                        </div>`;
                    listaProyectosContainer.appendChild(div);
                });
            }

            // Actualizar Tarjetas de Métricas
            const faltantes = TOTAL_REQUERIDO - contador;
            const perc = Math.min((contador / TOTAL_REQUERIDO * 100), 100).toFixed(1);

            if (valCompletados) valCompletados.textContent = contador;
            if (valRestantes) valRestantes.textContent = faltantes < 0 ? 0 : faltantes;
            if (valPorcentaje) valPorcentaje.textContent = `${perc}%`;
            if (barraProgreso) barraProgreso.style.width = `${perc}%`;

            if (btnSubmit) {
                if (contador >= TOTAL_REQUERIDO) {
                    btnSubmit.disabled = true;
                    btnSubmit.style.opacity = "0.5";
                    btnSubmit.innerHTML = '<i class="fa-solid fa-lock"></i> Meta de 52 alcanzada';
                } else {
                    btnSubmit.disabled = false;
                    btnSubmit.style.opacity = "1";
                    btnSubmit.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> Guardar Proyecto';
                }
            }

            // Asignar clics a los tachos de basura dinámicos
            document.querySelectorAll('.btn-borrar').forEach(btn => {
                btn.onclick = () => eliminarProyecto(btn.getAttribute('data-id'));
            });
        }
    } catch (e) { 
        console.error("Error al cargar proyectos de la base de datos:", e); 
    }
}

// --- 4. ELIMINAR PROYECTO ---
async function eliminarProyecto(id) {
    if (confirm("⚠️ ¿Estás seguro de eliminar este proyecto? Los datos se borrarán permanentemente.")) {
        try {
            const respuesta = await fetch(`${API_URL}/proyectos/eliminar/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${tokenSesion}` }
            });
            const datos = await respuesta.json();
            if (datos.success) {
                cargarProyectos();
            } else {
                alert("Error al borrar el proyecto de la base de datos.");
            }
        } catch (e) { 
            alert("Error de conexión al eliminar."); 
        }
    }
}

// --- 5. GUARDAR PROYECTO ---
if (formProyecto) {
    formProyecto.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        const nombre = document.getElementById('nombre-proyecto').value.trim();
        const inputArchivo = document.getElementById('archivo-proyecto').files[0];

        if (!nombre || !inputArchivo) {
            alert("❌ Error: Debes colocar un nombre y adjuntar un archivo.");
            return;
        }

        try {
            if (btnSubmit) {
                btnSubmit.disabled = true;
                btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Guardando...';
            }

            const formData = new FormData();
            formData.append('titulo', nombre);
            formData.append('archivo', inputArchivo);
            formData.append('usuario_id', usuarioActual.id);
            formData.append('semestre_id', usuarioActual.semestre_id || 1);

            const respuesta = await fetch(`${API_URL}/proyectos/guardar`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${tokenSesion}` },
                body: formData
            });

            const datos = await respuesta.json();

            if (datos.success) {
                formProyecto.reset();
                cargarProyectos();
            } else {
                alert(datos.mensaje || "Error al guardar el archivo en el servidor.");
            }
        } catch (e) { 
            console.error(e);
            alert("Error de red al intentar guardar."); 
        } finally {
            if (btnSubmit) {
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> Guardar Proyecto';
            }
        }
    });
}

// --- 6. CALCULADORA DE NOTAS ---
const btnCalcNotas = document.getElementById('btn-calc-notas');
if (btnCalcNotas) {
    btnCalcNotas.addEventListener('click', () => {
        const n1 = parseFloat(document.getElementById('nota-c1').value) || 0;
        const n2 = parseFloat(document.getElementById('nota-c2').value) || 0;
        const n3 = parseFloat(document.getElementById('nota-c3').value) || 0;
        const final = (n1 * 0.33) + (n2 * 0.33) + (n3 * 0.34);
        
        const resBox = document.getElementById('res-nota-final');
        if (resBox) resBox.textContent = `Tu Nota Final: ${final.toFixed(2)}`;
    });
}