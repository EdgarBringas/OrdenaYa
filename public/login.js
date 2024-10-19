import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getFirestore, collection, getDocs,query, where } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC_Wa0iiqVm5SHWscXrYr5cd6bNkcX6D0Y",
    authDomain: "ordena-ya-f2db4.firebaseapp.com",
    projectId: "ordena-ya-f2db4",
    storageBucket: "ordena-ya-f2db4.appspot.com",
    messagingSenderId: "458759132135",
    appId: "1:458759132135:web:94e67f7eb0564bf79d6342"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

 
// Función para verificar si el usuario existe y la contraseña es correcta
async function verificarCredenciales(username, password) {
    const usersRef = collection(db, "usuarios");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    // Verificar si existe el usuario
    if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        // Comparar la contraseña
        return userData.password === password; // Verificar si la contraseña coincide
    }

    return false; // Usuario no encontrado
}

// Evento para el formulario de inicio de sesión
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const isValid = await verificarCredenciales(username, password);

        if (isValid) {
            // Redirigir a la página de pedidos
            //window.location.href = "pedidos.html";
            window.location.href = "index.html";
        } else {
            alert("Nombre de usuario o contraseña incorrectos");
        }
    });
});