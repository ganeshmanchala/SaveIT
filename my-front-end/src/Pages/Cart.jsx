import { useEffect } from 'react';
import axios from 'axios';
import { useAuth } from "../Components/AuthContext";
const apiUrl = import.meta.env.VITE_API_URL;

import { useCart } from "../Components/cartContext";
import { X } from "lucide-react";

const CartPage = () => {
  const { cart, removeFromCart } = useCart();
  useEffect(() => {
    const checkExpirations = async () => {
      const now = new Date();
      const expiredItems = cart.filter(item => 
        new Date(item.expiration) < now
      );
  
      if (expiredItems.length > 0) {
        await Promise.all(expiredItems.map(item => 
          axios.post(`${apiUrl}/api/releaseItem`, { itemId: item._id },{
            withCredentials: true // This is crucial
          })
        ));
        fetchData(); // Refresh cart and items
      }
    };
    checkExpirations();
  const interval = setInterval(checkExpirations, 60000); // Check every minute
  return () => clearInterval(interval);
}, [cart]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-orange-600 mb-8 text-center font-lobster">
          🛒 My Food Cart
        </h2>
        
        {cart.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
            <p className="text-gray-600 text-lg">Your cart is empty. Start adding delicious food items!</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {cart.map((item) => (
              <div key={item._id} className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
                <div className="flex items-start gap-4">
                  <img
                    src={item.img}
                    alt={item.item_name}
                    className="w-24 h-24 object-cover rounded-lg border border-orange-100"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {item.item_name}
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                        </svg>
                        {item.prepared?.date} at {item.prepared?.Time}
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                        </svg>
                        {item.location?.place?.substring(0, 40) || 'Location not specified'}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
                      {item.quantity} servings
                    </div>
                    <button
                      onClick={() => removeFromCart(item)}
                      className="text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;