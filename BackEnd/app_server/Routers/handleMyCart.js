import { Router } from "express";
import { body, validationResult } from 'express-validator';
import { MyCart } from "../MyCart.js";

const router = Router();

router.post('/getMyCart', async (req, res) => {
    try {
        const { Username } = req.body;

        const existingCart = await MyCart.findOne({ Username });

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

// Update/Add to Cart
router.post('/UpdateMyCart', async (req, res) => {
    try {
        console.log("Received request:", req.body);

        const { Username, Cart } = req.body;
        if (!Username || !Cart) {
            return res.status(400).json({ message: "Invalid request. Username and Cart are required." });
        }

        console.log(`Checking for existing cart for: ${Username}`);

        const updatedCart = await MyCart.findOneAndUpdate(
            { Username },
            { $set: { Cart } },
            { new: true, upsert: true }
        );

        console.log("Cart updated successfully");
        res.status(200).json({ message: "Cart updated successfully", cart: updatedCart });

    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});


export const handleMyCart = router;
