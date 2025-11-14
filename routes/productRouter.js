import express from 'express';
import { CreateProduct, getProduct,getProductById, deleteProduct, updateProduct, searchProduct} from '../controllers/productController.js';
import { get } from 'mongoose';



const productRouter = express.Router();

productRouter.post('/', CreateProduct);
productRouter.get('/', getProduct);

// support both query string (?query=..., ?q=..., ?id=...) and path param (/search/:q)
productRouter.get('/search', searchProduct);
productRouter.get('/search/:q', searchProduct);
productRouter.get('/:id', getProductById);
productRouter.delete('/:id', deleteProduct);
productRouter.put('/:id', updateProduct);

export default productRouter;