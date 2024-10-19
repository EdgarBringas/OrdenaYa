// Importar los módulos necesarios de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

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

// Función para agregar un pedido
async function agregarPedido(pedido, cantidad, comentario, mesa, estado, precio) {
    await addDoc(collection(db, "pedidos"), {
        pedido,
        cantidad,
        comentario,
        mesa,
        estado,
        precio
    });

    console.log("Pedido agregado");
}

// Función para cargar los pedidos
async function loadOrders() {
    const pedidosCol = collection(db, "pedidos");
    const pedidosSnapshot = await getDocs(pedidosCol);
    const pedidosList = pedidosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    const ordersBody = document.getElementById("ordersBody");
    ordersBody.innerHTML = ""; // Limpiar tabla antes de cargar nuevos pedidos

    pedidosList.forEach((pedido) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${pedido.pedido}</td>
            <td>${pedido.cantidad}</td>
            <td>${pedido.comentario}</td>
            <td>${pedido.mesa}</td>
            <td>${pedido.estado}</td>
            <td>${pedido.precio}</td>
            <td>
                <button onclick="actualizarPedido('${pedido.id}', '${pedido.estado === 'en espera' ? 'servido' : 'en espera'}')">Cambiar Estado</button>
                <button onclick="eliminarPedido('${pedido.id}')">Eliminar</button>
            </td>
        `;
        ordersBody.appendChild(row);
    });

    // Llamar a calcularSumaTotal para actualizar el total
    calcularSumaTotal();
}

// Evento para el formulario
document.getElementById('orderForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const pedido = document.getElementById('pedido').value;
    const cantidad = parseInt(document.getElementById('cantidad').value);
    const comentario = document.getElementById('comentario').value;
    const mesa = document.getElementById('mesa').value;
    const estado = document.getElementById('estado').value;
    const precio = parseFloat(document.getElementById('precio').value);

    // Agregar pedido a Firestore
    await agregarPedido(pedido, cantidad, comentario, mesa, estado, precio);

    // Limpiar formulario
    document.getElementById('orderForm').reset();

    // Actualizar la tabla
    loadOrders();
});

// Función para actualizar el estado de un pedido
async function actualizarPedido(id, estado) {
    console.log("Intentando actualizar el pedido con ID:", id, "Estado nuevo:", estado);
    const pedidoRef = doc(db, "pedidos", id);
    await updateDoc(pedidoRef, {
        estado: estado
    });
    console.log("Pedido actualizado con ID: ", id);

    loadOrders(); // Recargar la lista de pedidos después de actualizar
}

// Función para eliminar un pedido
async function eliminarPedido(id) {
    console.log("Intentando eliminar el pedido con ID:", id);
    await deleteDoc(doc(db, "pedidos", id));
    console.log("Pedido eliminado con ID: ", id);

    loadOrders(); // Recargar la lista de pedidos después de eliminar
}

// Función para calcular la suma total de dinero ganado
async function calcularSumaTotal() {
    const pedidosList = await obtenerPedidos(); // Obtener la lista de pedidos
    const total = pedidosList.reduce((acc, pedido) => acc + pedido.precio, 0); // Sumar los precios
    document.getElementById("totalGanado").textContent = `Total Ganado: $${total.toFixed(2)}`; // Mostrar el total
}

// Función para obtener todos los pedidos
async function obtenerPedidos() {
    const pedidosCol = collection(db, "pedidos");
    const pedidosSnapshot = await getDocs(pedidosCol);
    return pedidosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}

// Función para cargar los pedidos cuando se carga la página
window.onload = async () => {
    await loadOrders();
};

// Hacer que las funciones sean accesibles globalmente
window.actualizarPedido = actualizarPedido;
window.eliminarPedido = eliminarPedido;