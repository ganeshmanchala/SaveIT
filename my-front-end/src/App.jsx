import { useState } from 'react';
import Navbar from './Components/Navbar/Navbar';
import './App.css';
import Body from './Components/Body/Body';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './Components/cartContext';
function App() {
  return (
    
    <div className="h-screen flex flex-col">     
      <BrowserRouter>
       <CartProvider>
        <Navbar />
        <div className="flex-1 overflow-y-auto ">
          <Body />
        </div>
        </CartProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
