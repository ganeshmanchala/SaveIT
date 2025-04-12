import { Router } from "express";
import { body, validationResult } from 'express-validator';
import { Items } from "../Items.js";
import { v2 as cloudinary } from 'cloudinary';
import cron from 'node-cron';
import mongoose from "mongoose";


const router = Router();

cron.schedule('* * * * *', async () => {
  const expiredItems = await Items.find({
    status: 'reserved',
    expirationTime: { $lte: new Date() }
  });

  expiredItems.forEach(async (item) => {
    item.status = 'available';
    item.reservedBy = null;
    item.reservationTime = null;
    item.expirationTime = null;
    await item.save();
    broadcastUpdate(item);
  });
});
router.post('/addProduct', 
  body('username').isLength({ min: 5 }),
  async (req, res) => {
    try {
      let imageUrl = "";
      
      // Handle file upload
      if (req.files && req.files[0]) {
        const file = req.files[0];
        const b64 = Buffer.from(file.buffer).toString("base64");
        const dataURI = "data:" + file.mimetype + ";base64," + b64;
        
        const cloudResult = await cloudinary.uploader.upload(dataURI, {
          folder: "food-donations"
        });
        imageUrl = cloudResult.secure_url;
      }

      // Create new item with image URL
      const newItem = await Items.create({
        username: req.body.username,
        item_name: req.body.item_name,
        quantity: req.body.quantity,
        img: imageUrl,
        location: {
          lat: req.body.location.lat,
          lon: req.body.location.lon,
          place: req.body.location.place
        },
        prepared: {
          date: req.body.preparedDate,
          Time: req.body.preparedTime
        }
      });

      res.json({ success: true, data: newItem });
    } catch (error) {
      console.error("Error adding product:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

  router.post('/removeMyProduct',
  async (req, res) => {

    try {
        
       Items.deleteOne({_id:req.body._id})
       .then((result)=>{
        res.json({ success: true ,result:result});
       },(err)=>{
        res.json({ success: false,errors:err });
       })

    
    }
    catch (error) {
      console.log("errror during creation of the products");
      res.json({ success: false })
    }
  })
  export const addProduct = router;