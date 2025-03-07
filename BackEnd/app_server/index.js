import express from 'express';
import mongoose from 'mongoose';
import { createAccount } from './Routers/CreateAccount.js';
import { displayProducts } from './Routers/DisplayProducts.js';
import { addProduct } from './Routers/addProducts.js';
import { handleMyCart } from './Routers/handleMyCart.js';
const mongoURL = 'mongodb+srv://ganesmanchala:Ganesh%402004@saveit.3xxmt.mongodb.net/SaveIT';
import cors from 'cors'
const app = express();
app.use(cors({ }));
mongoose
    .connect(mongoURL)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.error("Error during mongoose connection", err);
    });


app.use(express.json())


app.use('/api',createAccount)

app.use('/api',displayProducts)
app.use('/api',addProduct)
app.use('/api',handleMyCart)

app.get('/', async (req, res) => {
   
   
});



app.listen(8000, function () {
    console.log(`Server is listening on port 8000`);
});
