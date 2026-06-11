// frontend/Login/login.js
import { API_URL } from '../config.js'; // Importamos la URL del servidor local (http://localhost:5000/api)

const loginForm = document.getElementById('form-login');
const emailInput = document.getElementById('login-email');
const passwordInput = document.getElementById('login-pass');
const togglePassword = document.getElementById('btn-ver-pass');
const btnTheme = document.getElementById('btn-theme');

// --- 1. SISTEMA DE MODO OSCURO (Se mantiene exactamente igual) ---
const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const icon = btnTheme.querySelector('i');
    if (theme === 'dark') {
        icon.classList.replace('fa-moon', 'fa-sun');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
    }
};

const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

btnTheme.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
});

// --- 2. LOGIN CON VALIDACIÓN Y CONEXIÓN AL BACKEND ---
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Validación de campos vacíos
        if (!email || !password) {
            alert("❌ Por favor, llena todos los campos.");
            return;
        }

        try {
            // Hacemos la petición HTTP POST a nuestro propio backend
            const respuesta = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    correo: email, 
                    contrasena: password 
                })
            });

            const datos = await respuesta.json();

            if (datos.success) {
                // REQUISITO DE SEGURIDAD: Guardar el token JWT en el navegador
                localStorage.setItem('token', datos.token);
                
                // Guardamos los datos del usuario logueado para usarlos en el Dashboard
                localStorage.setItem('usuario', JSON.stringify(datos.usuario));

                alert("¡Inicio de sesión exitoso!");
                window.location.href = "../Dashboard.html"; 
            } else {
                // Si el backend responde con un error controlado (Contraseña incorrecta, correo no existe)
                alert(`⚠️ ${datos.mensaje}`);
            }
            
        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
            alert("❌ No se pudo conectar con el servidor backend. Asegúrate de tenerlo encendido.");
        }
    });
}

// --- 3. MOSTRAR/OCULTAR CONTRASEÑA (Se mantiene igual) ---
if (togglePassword) {
    togglePassword.addEventListener('click', () => {
        const isPassword = passwordInput.getAttribute('type') === 'password';
        passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
        
        togglePassword.classList.toggle('fa-eye');
        togglePassword.classList.toggle('fa-eye-slash');
    });
}