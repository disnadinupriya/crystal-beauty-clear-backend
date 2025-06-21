import express from 'express';
import { CreateProduct, getProduct, deleteProduct, updateProduct } from '../controllers/productController.js';
import { get } from 'mongoose';


const productRouter = express.Router();

productRouter.post('/', CreateProduct);
productRouter.get('/', getProduct);
productRouter.delete('/:id', deleteProduct);
productRouter.put('/:id', updateProduct);

export default productRouter;