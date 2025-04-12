import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
const apiUrl = import.meta.env.VITE_API_URL;

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get username from authenticated user
  const username = user?.Username;

  useEffect(() => {
    // console.log(username)
    if (username) {
      fetchCart();
    } else {
      // Clear cart when user logs out
      setCart([]);
      setLoading(false);
    }
  }, [username]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(`${apiUrl}/api/getMyCart`, { 
        username 
      },{
        withCredentials: true // This is crucial
      });
      
      if (data.success) {
        setCart(data.cart || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (item) => {
    try {
        const { data } = await axios.post(`${apiUrl}/api/reserveItem`, {
            itemId: item._id,
            username: user.Username
          },{
            withCredentials: true // This is crucial
          });
      
          if (!data.success) throw new Error('Item no longer available');
          
          // Use functional update to ensure latest state
          setCart(prev => {
            const newCart = [...prev, { 
              ...item,
              expiration: data.expirationTime,
              status: 'reserved'
            }];
            
            // Fire-and-forget cart update
            axios.post(`${apiUrl}/api/UpdateMyCart`, {
              username: user.Username,
              Cart: newCart
            },{
              withCredentials: true // This is crucial
            }).catch(console.error);
      
            return newCart;
          });
      
        } catch (err) {
      // Rollback on error
      setCart(cart);
      setError("Failed to add item to cart");
      throw err;
    }
  };

  const removeFromCart = async (item) => {
    const itemId=item._id
    try {
      const newCart = cart.filter(item => item._id !== itemId);
      setCart(newCart);
      
      await axios.post(`${apiUrl}/api/UpdateMyCart`, {
        username,
        Cart: newCart
      },{
        withCredentials: true // This is crucial
      });
      
    } catch (err) {
      // Rollback on error
      setCart(cart);
      setError("Failed to remove item from cart");
      throw err;
    }
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart,
      loading,
      error,
      clearError: () => setError(null)
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);