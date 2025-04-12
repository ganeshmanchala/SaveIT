import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useCart } from "../Components/cartContext";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, removeFromCart } = useCart();
  const [routeData, setRouteData] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleReach = async (item) => {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      
      const userCoords = [position.coords.latitude, position.coords.longitude];
      const itemCoords = [item.location.lat, item.location.lon];
      
      setUserLocation(userCoords);
      setSelectedItem({ ...item, coords: itemCoords });
      
      // Fetch route from OSRM API
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${userCoords[1]},${userCoords[0]};${itemCoords[1]},${itemCoords[0]}?overview=full&geometries=geojson`
      );
      
      const data = await response.json();
      if (data.routes) {
        setRouteData(data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]));
      }
    } catch (error) {
      alert("Error getting route: " + error.message);
    }
  };

  return (
    <div className={`fixed right-0 top-0 h-full bg-white shadow-xl transform transition-all duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      style={{ width: selectedItem ? "80vw" : "400px", zIndex: 1000 }}>
      <div className="flex h-full">
        {/* Cart Section */}
        <div className={`${selectedItem ? "w-1/2" : "w-full"} h-full border-r`}>
          <div className="flex justify-between items-center p-4 border-b bg-orange-50">
            <h2 className="text-xl font-bold text-orange-600">My Food Cart</h2>
            <X className="cursor-pointer text-orange-600" onClick={onClose} />
          </div>
          
          <div className="p-4 overflow-y-auto h-[calc(100%-56px)]">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div key={item._id} className="mb-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center p-4">
                    <img
                      src={item.img}
                      alt={item.item_name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="ml-4 flex-1">
                      <h3 className="font-semibold text-gray-800">{item.item_name}</h3>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(item.prepared.date).toLocaleDateString()} at {item.prepared.Time}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => removeFromCart(item)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                      <button
                        onClick={() => handleReach(item)}
                        className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm hover:bg-orange-600"
                      >
                        Get Directions
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-8 text-gray-500">
                Your cart is empty. Start adding food items!
              </div>
            )}
          </div>
        </div>

        {/* Map Section */}
        {selectedItem && (
          <div className="w-1/2 h-full bg-gray-50 relative">
            {/* Close Map Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-2 right-2 z-[1000] bg-white p-2 rounded-full shadow-lg hover:bg-orange-50 text-orange-600 hover:text-orange-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="h-full">
              {userLocation && (
                <MapContainer
                  center={userLocation}
                  zoom={13}
                  className="h-full w-full"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  
                  <Marker position={userLocation}>
                    <Popup>Your Location</Popup>
                  </Marker>
                  
                  <Marker position={selectedItem.coords}>
                    <Popup>
                      <div className="text-sm">
                        <h3 className="font-semibold">{selectedItem.item_name}</h3>
                        <p>{selectedItem.location.place}</p>
                      </div>
                    </Popup>
                  </Marker>

                  {routeData && (
                    <Polyline 
                      positions={routeData}
                      color="#f97316"
                      weight={4}
                      opacity={0.7}
                    />
                  )}
                </MapContainer>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;