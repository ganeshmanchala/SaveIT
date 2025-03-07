import { Router } from "express";
import { body, validationResult } from 'express-validator';
import { Items } from "../Items.js";
const router = Router();
router.post('/addProduct',
    body('username', 'Username should have at least 5 characters').isLength({ min: 5 }),
  async (req, res) => {
    console.log("Hello");

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
        
      await Items.create({
        username:req.body.username,
        item_name:req.body.item_name,
        quantity:req.body.quantity,
        img:req.body.img,
        location:req.body.location,
        prepared:{
            date:req.body.prepared.date,
            Time:req.body.prepared.Time
        }
      }).then(()=>{
          res.json({data:req.body, success: true })
      })
    }
    catch (error) {
      console.log("errror during creation of the products");
      res.json({ success: false })
    }
  })

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