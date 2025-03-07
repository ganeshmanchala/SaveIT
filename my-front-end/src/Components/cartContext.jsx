import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const Username = localStorage.getItem("Username"); // Assuming username is stored in localStorage

    useEffect(() => {
        if (Username) {
            fetchCart();
        }
    }, [Username]);

    // Fetch Cart from Backend
    const fetchCart = async () => {
        try {
            const response = await axios.post(`${apiUrl}/api/getMyCart`, { Username });
            if (response.data.success) {
                setCart(response.data.cart);
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    };

    // Add to Cart
    const addToCart = (item) => {
        setCart((prevCart) => {
            if (!prevCart.some(cartItem => cartItem._id === item._id)) {
                const updatedCart = [...prevCart, item];
                updateCartInBackend(updatedCart);
                return updatedCart;
            }
            return prevCart;
        });
    };

    // Remove from Cart
    const removeFromCart = (item) => {
        setCart((prevCart) => {
            const updatedCart = prevCart.filter(cartItem => cartItem._id !== item._id);
            updateCartInBackend(updatedCart);
            return updatedCart;
        });
    };

    // Update Cart in Backend
    const updateCartInBackend = async (updatedCart) => {
        try {
            await axios.post(`${apiUrl}/api/UpdateMyCart`, { Username, Cart: updatedCart });
        } catch (error) {
            console.error("Error updating cart:", error);
        }
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
