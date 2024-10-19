// Importar los módulos de Firebase
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

// Función para agregar un producto
async function agregarProducto(idPro, nombre, cantidad, precio, f_in, f_ex) {
    await addDoc(collection(db, "inventario"), {
        idPro,
        nombre,
        cantidad,
        precio,
        f_in,
        f_ex
    });
    console.log("Producto agregado");
    loadInventario(); // Recargar el inventario después de agregar
}

// Función para cargar el inventario
async function loadInventario() {
    const inventarioCol = collection(db, "inventario");
    const inventarioSnapshot = await getDocs(inventarioCol);
    const inventarioList = inventarioSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    const inventoryBody = document.getElementById("inventoryBody");
    inventoryBody.innerHTML = ""; // Limpiar tabla antes de cargar nuevos productos

    inventarioList.forEach((producto) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${producto.idPro}</td>
            <td>${producto.nombre}</td>
            <td>${producto.cantidad}</td>
            <td>${producto.precio}</td>
            <td>${producto.f_in}</td>
            <td>${producto.f_ex}</td>
            <td>
                <button onclick="actualizarProducto('${producto.id}', ${producto.cantidad}, ${producto.precio})">Actualizar</button>
                <button onclick="eliminarProducto('${producto.id}')">Eliminar</button>
            </td>
        `;
        inventoryBody.appendChild(row);
    });
}

// Función para actualizar un producto
async function actualizarProducto(id, cantidad, precio) {
    const newCantidad = prompt("Ingrese nueva cantidad:", cantidad);
    const newPrecio = prompt("Ingrese nuevo precio:", precio);

    if (newCantidad !== null && newPrecio !== null) {
        const productoRef = doc(db, "inventario", id);
        await updateDoc(productoRef, {
            cantidad: parseInt(newCantidad),
            precio: parseFloat(newPrecio)
        });
        console.log("Producto actualizado con ID:", id);
        loadInventario(); // Recargar el inventario después de actualizar
    }
}

// Función para eliminar un producto
async function eliminarProducto(id) {
    console.log("Intentando eliminar el producto con ID:", id);
    await deleteDoc(doc(db, "inventario", id));
    console.log("Producto eliminado con ID:", id);
    loadInventario(); // Recargar el inventario después de eliminar
}

// Evento para el formulario de agregar productos
document.getElementById('addProductForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const idPro = document.getElementById('productId').value;
    const nombre = document.getElementById('productName').value;
    const cantidad = parseInt(document.getElementById('productQuantity').value);
    const precio = parseFloat(document.getElementById('productPrice').value);
    const f_in = document.getElementById('entryDate').value;
    const f_ex = document.getElementById('expirationDate').value;
    await agregarProducto(idPro, nombre, cantidad, precio, f_in, f_ex);

    // Limpiar formulario
    document.getElementById('addProductForm').reset();
});

// Cargar el inventario al cargar la página
window.onload = async () => {
    await loadInventario();
};


window.actualizarProducto = actualizarProducto;
window.eliminarProducto = eliminarProducto;