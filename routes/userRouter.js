import express from 'express';
import { loginUser, saveUser, googleLogin, getCurrentUser } from '../controllers/userController.js';
import { get } from 'mongoose';

const userRouter = express.Router();

userRouter.post('/', saveUser);
userRouter.post('/login', loginUser);
userRouter.post('/google',googleLogin);
userRouter.get('/current', getCurrentUser);



export default userRouter;