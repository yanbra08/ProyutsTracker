// frontend/Register/register.js
import { API_URL } from '../config.js'; // Importamos la URL de tu backend (http://localhost:5000/api)

const form = document.getElementById('form-registro');
const passwordInput = document.getElementById('reg-pass');
const togglePassword = document.getElementById('btn-ver-pass');
const btnTheme = document.getElementById('btn-theme');

// --- 1. SISTEMA DE MODO OSCURO (Sincronizado - Queda igual) ---
const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const icon = btnTheme.querySelector('i');
    icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
};

const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

btnTheme.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

// --- 2. MOSTRAR/OCULTAR CONTRASEÑA (Queda igual) ---
if (togglePassword) {
    togglePassword.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        togglePassword.className = isPassword ? 'fa-regular fa-eye-slash toggle-password' : 'fa-regular fa-eye toggle-password';
    });
}

// --- 3. PROCESO DE REGISTRO CONEXIÓN BACKEND ---
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        
        const nombre = document.getElementById('reg-nombre').value.trim();
        const email = document.getElementById('reg-correo').value.trim();
        const password = passwordInput.value;
        const btnRegistrar = document.getElementById('btn-registrar');

        // REQUISITO UNIVERSIDAD: Capturar el semestre seleccionado del select
        // Asegúrate de agregar este id="reg-semestre" en tu archivo HTML de registro
        const semestreSelect = document.getElementById('reg-semestre');
        const semestre_id = semestreSelect ? parseInt(semestreSelect.value) : 1; 

        // Validación de seguridad (mínimo 8 caracteres)
        if (password.length < 8) {
            alert("❌ La contraseña debe tener al menos 8 caracteres.");
            return;
        }

        try {
            btnRegistrar.disabled = true;
            btnRegistrar.textContent = "Registrando...";

            // Hacemos la petición HTTP POST a nuestro endpoint de Node.js
            const respuesta = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre: nombre,
                    correo: email,
                    contrasena: password,
                    semestre_id: semestre_id // Pasamos el semestre seleccionado para la relación SQL
                })
            });

            const datos = await respuesta.json();

            if (datos.success) {
                alert("¡Registro exitoso! Bienvenido/a " + nombre);
                window.location.href = "../Login/Login.html"; // Redirige a tu login
            } else {
                // Errores controlados por tu controlador (ej: correo ya registrado)
                alert(`⚠️ ${datos.mensaje}`);
                btnRegistrar.disabled = false;
                btnRegistrar.textContent = "Registrarse";
            }

        } catch (error) {
            console.error("Error al conectar al servidor:", error);
            btnRegistrar.disabled = false;
            btnRegistrar.textContent = "Registrarse";
            alert("❌ Error: No se pudo conectar con el servidor backend.");
        }
    });
}