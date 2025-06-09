import { useState, useEffect } from 'react';
import io from 'socket.io-client';

// 1. Conectamos con nuestro servidor de backend
// Es importante no definir esto dentro del componente para evitar reconexiones en cada render
const socket = io("http://localhost:3001");

function App() {
  const [code, setCode] = useState('');

  // 3. useEffect para manejar los eventos de socket
  useEffect(() => {
    // Función para manejar las actualizaciones de código que vienen del servidor
    const handleCodeUpdate = (newCode) => {
      setCode(newCode);
    };

    // Nos suscribimos al evento 'code-update'
    socket.on('code-update', handleCodeUpdate);

    // Es una buena práctica limpiar el listener cuando el componente se desmonta
    return () => {
      socket.off('code-update', handleCodeUpdate);
    };
  }, []); // El array vacío asegura que este efecto se ejecute solo una vez

  // 2. Función para manejar los cambios en el textarea
  const handleChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    // Emitimos el evento 'code-change' al servidor con el nuevo código
    socket.emit('code-change', newCode);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-8 font-sans">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-cyan-400">Editor Colaborativo</h1>
        <p className="text-gray-400">Escribe en el área de texto y mira la magia suceder en otra pestaña.</p>
      </header>
      <main className="w-full max-w-4xl h-[60vh]">
        <textarea
          className="w-full h-full p-4 bg-gray-800 border-2 border-gray-700 rounded-lg text-lg font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500"
          value={code}
          onChange={handleChange}
          spellCheck="false"
        />
      </main>
    </div>
  );
}

export default App;