import mongoose from "mongoose";

const MyCartSchema = new mongoose.Schema({
  username: { // Keep lowercase for consistency
    type: String,
    required: true,
  },
  Cart: {
    type: Array,
    required: true,
  }
}, { collection: 'MyCart' });
export const MyCart = mongoose.model('MyCart', MyCartSchema);
