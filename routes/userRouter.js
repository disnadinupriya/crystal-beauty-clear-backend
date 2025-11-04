import express from 'express';
import { loginUser, saveUser, googleLogin} from '../controllers/userController.js';
import { get } from 'mongoose';

const userRouter = express.Router();

userRouter.post('/', saveUser);
userRouter.post('/login', loginUser);
userRouter.post('/google',googleLogin);



export default userRouter;