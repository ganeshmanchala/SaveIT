import express from 'express'
import { Router } from 'express'
import { Items } from '../Items.js';
import mongoose from 'mongoose';

const router = Router();

router.post('/displayProducts', async (req, res) => {
    try {
        const data = await Items.find({});  // Fetch from the "Items" collection
        res.json(data);
        // console.log(data);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ errors: { msg: "Error fetching data" } });
    }
});

router.post('/displayMyProducts', async (req, res) => {
    try {
        const data = await Items.find({username:req.body.username});  // Fetch from the "Items" collection
        res.json(data);
        console.log(data);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ errors: { msg: "Error fetching data" } });
    }
});

export const displayProducts = router;
