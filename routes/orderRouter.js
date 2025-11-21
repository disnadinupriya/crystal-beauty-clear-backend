import express from 'express';
import { createOrder, getOrders , updateOrder, deleteOrder} from '../controllers/orderController.js';


const orderRouter = express.Router();

orderRouter.post('/',  createOrder);
orderRouter.get('/', getOrders);
orderRouter.put('/:orderId', updateOrder);
orderRouter.delete('/:orderId', deleteOrder);

export default orderRouter;
