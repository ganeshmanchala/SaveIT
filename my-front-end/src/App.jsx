import { useState, useEffect, useRef } from 'react';
import Navbar from './Components/Navbar/Navbar';
import './App.css';
import Body from './Components/Body/Body';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './Components/cartContext';
import { useAuth } from './Components/AuthContext';

function App() {
  const { user } = useAuth();
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    const connectWebSocket = () => {
      const wsUrl = import.meta.env.VITE_WS_URL || 
        `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${
          window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`;

      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connected');
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        // Handle different message types here
        console.log('Received message:', message);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = (event) => {
        if (event.code !== 1000) { // Abnormal closure
          console.log('WebSocket closed, reconnecting...');
          reconnectTimeoutRef.current = setTimeout(connectWebSocket, 3000);
        }
      };

      wsRef.current = ws;
    };

    if (user) {
      connectWebSocket();
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, [user]);

  return (
    <div className="h-screen flex flex-col">
      <BrowserRouter>
        <CartProvider>
          <Navbar />
          <div className="flex-1 overflow-y-auto pt-28">
            <Body />
          </div>
        </CartProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;