import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  item_name: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  prepared: {
    date: {
      type: String,
      required: true,
    },
    Time: {
      type: String,
      required: true,
    },
  },
  location: {
    type: String,
    required: true,
  },
}, {
  collection: 'Items', // Specify the collection name
});

export const Items = mongoose.model('Items', ItemSchema);
