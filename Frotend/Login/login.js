// frontend/Login/login.js
import { API_URL } from '../config.js'; // Importamos la URL unificada desde config.js

const loginForm = document.getElementById('form-login');
const emailInput = document.getElementById('login-email');
const passwordInput = document.getElementById('login-pass');
const togglePassword = document.getElementById('btn-ver-pass');
const btnTheme = document.getElementById('btn-theme');

// --- 1. SISTEMA DE MODO OSCURO ---
const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const icon = btnTheme ? btnTheme.querySelector('i') : null;
    if (icon) {
        if (theme === 'dark') {
            icon.classList.replace('fa-moon', 'fa-sun');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
        }
    }
};

const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

if (btnTheme) {
    btnTheme.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });
}

// --- 2. LOGIN CON VALIDACIÓN Y CONEXIÓN AL BACKEND ---
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        // Evitamos CUALQUIER comportamiento de recarga automática (F5) del formulario
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const btnEnviar = loginForm.querySelector('button[type="submit"]');
        const textoOriginalBtn = btnEnviar ? btnEnviar.textContent : "Ingresar";

        // Validación de campos vacíos
        if (!email || !password) {
            alert("❌ Por favor, llena todos los campos.");
            return;
        }

        try {
            // Efecto visual de carga en el botón para que el usuario no spamee clics
            if (btnEnviar) {
                btnEnviar.disabled = true;
                btnEnviar.textContent = "Verificando...";
            }

            // Hacemos la petición HTTP POST a nuestro backend en Railway usando la ruta de config.js
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

            if (datos.success || respuesta.ok) {
                // REQUISITO DE SEGURIDAD: Guardar el token JWT en el navegador
                if (datos.token) localStorage.setItem('token', datos.token);
                
                // Guardamos los datos del usuario logueado para usarlos en el Dashboard
                if (datos.usuario) localStorage.setItem('usuario', JSON.stringify(datos.usuario));

                alert("¡Inicio de sesión exitoso!");
                window.location.href = "../Dashboard.html"; 
            } else {
                // Si el backend responde con un error controlado de credenciales inválidas
                alert(`⚠️ ${datos.mensaje || "Correo o contraseña incorrectos."}`);
                if (btnEnviar) {
                    btnEnviar.disabled = false;
                    btnEnviar.textContent = textoOriginalBtn;
                }
            }
            
        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
            alert("❌ No se pudo conectar con el servidor backend. Asegúrate de que Railway esté activo.");
            
            // Reestablecemos el botón en caso de error de red externa
            if (btnEnviar) {
                btnEnviar.disabled = false;
                btnEnviar.textContent = textoOriginalBtn;
            }
        }
    });
}

// --- 3. MOSTRAR/OCULTAR CONTRASEÑA ---
if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', () => {
        const isPassword = passwordInput.getAttribute('type') === 'password';
        passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
        
        togglePassword.classList.toggle('fa-eye');
        togglePassword.classList.toggle('fa-eye-slash');
    });
}