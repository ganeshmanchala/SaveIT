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
    validate: {
      validator: (v) => {
        return v.startsWith('http') || v.startsWith('data:image');
      },
      message: "Invalid image URL format"
    }
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
    lat: {
      type: String, // Consider using Number type if storing coordinates
      required: true,
    },
    lon: {
      type: String, // Consider using Number type if storing coordinates
      required: true,
    },
    place: {
      type: String
      
    },
    status: {
      type: String,
      enum: ['available', 'reserved', 'expired'],
      default: 'available' // Add default value
    },
    reservedBy: {
      type: String,  // username
      default: null
    },
    reservationTime: {
      type: Date,
      default: null
    },
    expirationTime: {
      type: Date,
      default: null
    }
  },
}, {
  collection: 'Items', // Specify the collection name
});

export const Items = mongoose.model('Items', ItemSchema);
