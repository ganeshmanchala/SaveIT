import React from 'react';
import Home from '../../Pages/Home';

import { Routes, Route } from 'react-router-dom';
import Helper from '../../Pages/Helper';
import Acceptor from '../../Pages/Acceptor';
import Contact from '../../Pages/Contact';
import Login from '../../Pages/Login';
import Cart from '../../Pages/Cart';

const Body = () => {
  return (
    <div className='body relative h-full w-screen overflow-y-auto'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/helper' element={<Helper />} />
        <Route path='/acceptor' element={<Acceptor />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/login' element={<Login />} />
        <Route path='/cart' element={<Cart />} />
      </Routes>
    </div>
  );
}

export default Body;
