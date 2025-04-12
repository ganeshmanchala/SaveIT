import { Router } from "express";
import { MyCart } from "../MyCart.js";
import mongoose from "mongoose";
import { Items } from "../Items.js";
import { WebSocket } from 'ws';

// Modified to accept WebSocket server as parameter
export const handleMyCart = (wss) => {
  const router = Router();

  // Add broadcast function inside the router closure
  const broadcastUpdate = (item) => {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'ITEM_UPDATE',
          item: {
            ...item.toObject(),
            _id: item._id.toString()
          }
        }));
      }
    });
  };

  // Routes
  router.post('/getMyCart', async (req, res) => {
    try {
      const { username } = req.body;
      const existingCart = await MyCart.findOne({ username });

      if (existingCart) {
        res.json({ success: true, cart: existingCart.Cart });
      } else {
        res.json({ success: true, cart: [] });
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  });

  router.post('/UpdateMyCart', async (req, res) => {
    try {
      const { username, Cart } = req.body;
      const updatedCart = await MyCart.findOneAndUpdate(
        { username },
        { $set: { Cart } },
        { new: true, upsert: true }
      );

      res.status(200).json({ message: "Cart updated successfully", cart: updatedCart });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  });

  router.post('/reserveItem', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const { itemId, username } = req.body;
      
      if (!mongoose.Types.ObjectId.isValid(itemId)) {
        return res.status(400).json({ success: false, message: 'Invalid item ID' });
      }

      const expirationTime = new Date(Date.now() + 30 * 60 * 1000);

      const item = await Items.findOneAndUpdate(
        {  _id: itemId,
            $or: [
              { status: 'available' },
              { status: { $exists: false } } // Handle legacy items
            ]},
        {
          status: 'reserved',
          reservedBy: username,
          reservationTime: new Date(),
          expirationTime
        },
        { new: true, session }
      );

      if (!item) {
        await session.abortTransaction();
        return res.json({ success: false, message: 'Item no longer available' });
      }

      await session.commitTransaction();
      broadcastUpdate(item); // Use the local broadcast function
      res.json({ success: true, expirationTime });
    } catch (error) {
        if (session.inTransaction()) {
          await session.abortTransaction();
        }
        console.error("Reservation error:", error);
        res.status(500).json({ 
          success: false, 
          error: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
      } finally {
        session.endSession();
      }
  });

  router.post('/releaseItem', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const { itemId } = req.body;
      const item = await Items.findOneAndUpdate(
        { _id: itemId, status: 'reserved' },
        {
          status: 'available',
          reservedBy: null,
          reservationTime: null,
          expirationTime: null
        },
        { new: true, session }
      );

      if (!item) {
        await session.abortTransaction();
        return res.json({ success: false });
      }

      await session.commitTransaction();
      broadcastUpdate(item); // Use the local broadcast function
      res.json({ success: true });
    }catch (error) {
        if (session.inTransaction()) {
          await session.abortTransaction();
        }
        res.status(500).json({ success: false, error: error.message });
      } finally {
        session.endSession();
      }
  });

  return router;
};