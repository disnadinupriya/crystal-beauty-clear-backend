import express from 'express';
import { CreateProduct, getProduct,getProductById, deleteProduct, updateProduct } from '../controllers/productController.js';
import { get } from 'mongoose';



const productRouter = express.Router();

productRouter.post('/', CreateProduct);
productRouter.get('/', getProduct);
productRouter.get('/:id', getProductById);
productRouter.delete('/:id', deleteProduct);
productRouter.put('/:id', updateProduct);

export default productRouter;