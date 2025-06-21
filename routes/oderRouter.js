import express from 'express';
import { createOrder, getOrders } from '../controllers/oderController.js';
import { get } from 'mongoose';




const orderRouter = express.Router();

orderRouter.post('/', createOrder);

orderRouter.get('/', getOrders);


export default orderRouter;