import React, { useState } from "react";
import { X } from "lucide-react";
import { useCart } from "../Components/cartContext";
import MapComponent from "../Components/MapComponent";

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, removeFromCart } = useCart();
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Handle clicking "Reach" button
  const handleReach = (item) => {
    setSelectedItem(item);
    setIsMapVisible(true);
  };

  // Close the map
  const handleCloseMap = () => {
    setIsMapVisible(false);
    setSelectedItem(null);
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full ${
        isMapVisible ? "w-full" : "w-2/5"
      } bg-white shadow-lg transition-transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } z-50 flex`}
    >
      {/* Map Section - Visible when map is open */}
      {isMapVisible && (
  <div className="w-3/5 h-full relative bg-gray-100 flex flex-col">
    {/* Fixed Close Button */}
    <button
  className="absolute top-4 right-4 z-50 bg-black text-white px-3 py-2 rounded-full shadow-lg border border-white"
  onClick={handleCloseMap}
>
  ✖
</button>

    <MapComponent item={selectedItem} />
  </div>
)}

      {/* Cart Drawer Section */}
      <div className={`h-full ${isMapVisible ? "w-2/5" : "w-full"} bg-white`}>
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold">My Cart</h2>
          <X className="cursor-pointer" onClick={onClose} />
        </div>
        <div className="p-4 overflow-y-auto h-[85%]">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div key={item._id} className="flex-col justify-center items-center mb-4 border rounded">
                <div className="flex justify-between items-center p-2 border rounded">
                  <img
                    src={item.img}
                    alt={item.item_name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1 px-2">
                    <p className="text-sm font-medium">{item.item_name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>
                <div className="text-center p-2">
                  <button
                    onClick={() => handleReach(item)}
                    className="text-blue-500"
                  >
                    Reach
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">Your cart is empty</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
