import mongoose from "mongoose";

const MyCartSchema = new mongoose.Schema({
  Username: {
    type: String,
    required: true,
  },
  Cart:{
    type: Array,
    required:true,
  }
}, {
  collection: 'MyCart', // Specify the collection name
});

export const MyCart = mongoose.model('MyCart', MyCartSchema);
