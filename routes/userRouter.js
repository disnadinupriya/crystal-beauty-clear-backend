import express from 'express';
import { loginUser, saveUser, googleLogin, getCurrentUser , sendOtp, changePassword} from '../controllers/userController.js';
import { get } from 'mongoose';

const userRouter = express.Router();

userRouter.post('/', saveUser);
userRouter.post('/login', loginUser);
userRouter.post('/google',googleLogin);
userRouter.get('/current', getCurrentUser);
userRouter.post('/sendMail', sendOtp);
userRouter.post('/changePw', changePassword);



export default userRouter;