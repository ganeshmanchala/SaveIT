import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { useCart } from "../Components/cartContext";
import { useAuth } from "../Components/AuthContext";
import Countdown from 'react-countdown';
const apiUrl = import.meta.env.VITE_API_URL;
const wsUrl = import.meta.env.VITE_WS_URL || 
`${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${
  window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`;

const Acceptor = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  const { cart, addToCart, removeFromCart } = useCart();
  const [loading, setLoading] = useState(true);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${apiUrl}/api/displayProducts`,{
        withCredentials: true // This is crucial
      });
      setProducts(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    } 
  };

  useEffect(() => {
    let ws;
    if (user) {
      ws = new WebSocket(wsUrl);
      
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'ITEM_UPDATE') {
          setProducts(prev => prev.map(item => 
            item._id === message.item._id ? message.item : item
          ));
        }
      };
  
      // Add error handler
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    }
  
    return () => {
      if (ws) ws.close();
    };
  }, [user]);
  useEffect(() => {
    const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (searchQuery) {
      const filtered = products.filter((product) =>
        product.item_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

  const availableItems = filteredProducts.filter(item => 
    (!item.status || item.status === 'available') ||
    (item.status === 'reserved' && item.reservedBy === user?.Username)
  );
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 p-8">
        <div className="text-center text-orange-600">Loading available food...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-orange-600 mb-8 text-center font-lobster">
          🍽️ Available Food Near You
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableItems.map((product) => {
            const isInCart = cart.some(cartItem => cartItem._id === product._id);

            return (
              <div key={product._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={product.img}
                    alt={product.item_name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
                    {product.quantity} servings
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.item_name}</h3>
                  <div className="text-sm text-gray-600 mb-3">
                    <div className="flex items-center mb-1">
                      <svg className="w-4 h-4 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                      </svg>
                      {product.location?.place?.substring(0, 30) || 'No location'}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                      </svg>
                      {product.prepared?.date} at {product.prepared?.Time}
                    </div>
                  </div>
                  {product.status === 'reserved' && (
                    <div className="bg-yellow-100 text-yellow-800 p-2 rounded mb-2">
                      Reserved - Expires in: 
                      <Countdown 
                        date={new Date(product.expirationTime)} 
                        renderer={({ minutes, seconds }) => `${minutes}m ${seconds}s`}
                      />
                    </div>
                  )}
                  <button
                    onClick={() => (isInCart ? removeFromCart(product) : addToCart(product))}
                    className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                      isInCart 
                        ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                        : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                    }`}
                  >
                    {isInCart ? 'Remove from Cart' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        {availableItems.length === 0 && !loading && (
          <div className="text-center text-orange-600 mt-8">
            No available food items found
          </div>
        )}
        </div>
      </div>
  );
};

export default Acceptor;
