// MainContainer.jsx
import React, { useState } from 'react';
import CartDrawer from './CartDrawer';
import MapComponent from '../Components/MapComponent';

const MainContainer = () => {
  const [isMapVisible, setIsMapVisible] = useState(false);

  const handleShowMap = () => {
    setIsMapVisible(true);
  };

  const handleCloseMap = () => {
    setIsMapVisible(false);
  };

  return (
    <div className="main-container">
      {isMapVisible ? (
        <div className="split-screen">
          <div className="map-container">
            <MapComponent onClose={handleCloseMap} />
          </div>
          <div className="cart-container">
            <CartDrawer onReachClick={handleShowMap} />
          </div>
        </div>
      ) : (
        <CartDrawer onReachClick={handleShowMap} />
      )}
    </div>
  );
};

export default MainContainer;
