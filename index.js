import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import userRouter from './routes/userRouter.js';
import usermodel from './models/user.js';
import jwt from 'jsonwebtoken';

import productRouter from './routes/productRouter.js';
import productModel from './models/product.js';
import verfyJwt from './middleware/auth.js';

import dotenv from 'dotenv';
import cors from 'cors';

import orderRouter from './routes/orderRouter.js';
import orderModel from './models/order.js';




dotenv.config();






// Create an Express application
let app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('Connected to MongoDB successfully');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(verfyJwt);

app.use(cors({
   // origin: 'http://localhost:5000'
   origin: '*'
}));


// <- This is fine if you keep spelling "oder"


app.use('/api/user', userRouter);

app.use('/api/product', productRouter);

app.use("/api/order", orderRouter);




// Start the server
app.listen(5000, () => {
    console.log('Server is running on port 5000');
})
