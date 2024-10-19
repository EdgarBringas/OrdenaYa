// registro.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC_Wa0iiqVm5SHWscXrYr5cd6bNkcX6D0Y",
    authDomain: "ordena-ya-f2db4.firebaseapp.com",
    projectId: "ordena-ya-f2db4",
    storageBucket: "ordena-ya-f2db4.appspot.com",
    messagingSenderId: "458759132135",
    appId: "1:458759132135:web:94e67f7eb0564bf79d6342"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para verificar si el usuario ya existe
async function verificarUsuario(username) {
    const usersRef = collection(db, "usuarios");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    console.log(`Verificando usuario: ${username}, Resultados: ${querySnapshot.size}`); // Mensaje de depuración
    return querySnapshot.empty; // Si está vacío, el usuario no existe
}


// Función para registrar un usuario
export async function registrarUsuario(username, password) {
    const userNoExists = await verificarUsuario(username);
    if (userNoExists) {
        await addDoc(collection(db, "usuarios"), {
            username: username,
            password: password
        });
        alert("Usuario registrado exitosamente");
    } else {
        alert("El nombre de usuario ya existe. Por favor, elige otro.");
    }
}

// Evento para el formulario de registro
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log("Formulario enviado");
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        await registrarUsuario(username, password);

        // Limpiar formulario
        document.getElementById('registerForm').reset();
    });
});

window.verificarUsuario = verificarUsuario;
window.registrarUsuario = registrarUsuario;