import React from "react";
import { useCart } from "../Components/cartContext";
const CartPage = () => {
  const { cart, removeFromCart } = useCart();
    console.log(cart);
  return (
    <div>
      <h2>Shopping Cart</h2>
      {cart.length === 0 ? <p>Your cart is empty</p> : null}
      {cart.map((item) => (
        <div key={item._id} className="cart-item">
          <h4>{item.item_name}</h4>
          <p>Price: ${item.price}</p>
          <button onClick={() => removeFromCart(item._id)}>Remove</button>
        </div>
      ))}
    </div>
  );
};

export default CartPage;
