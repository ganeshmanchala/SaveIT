import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { useCart } from "../Components/cartContext";
const apiUrl = import.meta.env.VITE_API_URL;

const Acceptor = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  const { cart, addToCart, removeFromCart } = useCart();

  const fetchData = async () => {
    try {
      const response = await axios.post(`${apiUrl}/api/displayProducts`);
      setProducts(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
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

  return (
    <div className="grid h-full w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 p-6 bg-cover"
    style={{
      backgroundImage:
        'url("https://cdn.deepseek.com/blog/banner-background.webp")',
    }}>
      {filteredProducts.map((product) => {
        const isInCart = cart.some((cartItem) => cartItem._id === product._id);

        return (
          <div key={product._id} className="relative rounded-xl bg-white shadow-lg group p-4 w-full bg-cover"
          style={{
            backgroundImage:
              'url("https://png.pngtree.com/thumb_back/fh260/background/20200710/pngtree-geometric-line-background-with-gradient-grey-image_351504.jpg")',
          }}>
            <div className="relative rounded-xl bg-gray-200 overflow-hidden border border-gray-300 h-64">
              <img
                src={product.img}
                alt={product.item_name}
                className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
              />
            </div>
            <div className="p-3 text-center">
              <h5 className="font-semibold text-lg">{product.item_name}</h5>
              <span className="text-gray-600 text-sm">Quantity: {product.quantity}</span>
            </div>
            <div className="p-3 flex flex-col items-center">
              <span className="text-gray-500 text-sm">
                Prepared: {product.prepared?.date || "N/A"} at {product.prepared?.Time || "N/A"}
              </span>
              <button
                onClick={() => (isInCart ? removeFromCart(product) : addToCart(product))}
                className="mt-3 border border-gray-500 text-gray-700 bg-white px-6 py-2 rounded-lg text-base font-bold hover:bg-gray-100"
              >
                {isInCart ? "Remove from Cart" : "Add to Cart"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Acceptor;
