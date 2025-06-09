// 1. Importar las dependencias necesarias
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

// 2. Configurar la app de Express y el servidor HTTP
const app = express();
const server = http.createServer(app);

// 3. Configurar Socket.IO con CORS
// Es MUY importante configurar CORS para permitir que tu app de React (que estará en otro puerto) se comunique con este servidor.
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // La URL por defecto de un proyecto de React con Vite
    methods: ["GET", "POST"]
  }
});

const PORT = 3001; // El puerto donde correrá nuestro servidor

// 4. Definir la lógica de conexión de Socket.IO
io.on('connection', (socket) => {
  console.log(`🔌 Un usuario se ha conectado con el id: ${socket.id}`);

  // Escuchar un evento 'code-change' desde el cliente
  socket.on('code-change', (code) => {
    // Cuando recibimos un cambio, lo reenviamos a TODOS los demás clientes
    socket.broadcast.emit('code-update', code);
  });

  // Escuchar cuando un usuario se desconecta
  socket.on('disconnect', () => {
    console.log(`👋 El usuario con id ${socket.id} se ha desconectado`);
  });
});


// 5. Iniciar el servidor
server.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});