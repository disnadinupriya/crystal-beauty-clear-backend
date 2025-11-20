// routes/userRouter.js
import express from 'express';
// 1. Import deleteUser here 👇
import { 
    loginUser, 
    saveUser, 
    googleLogin, 
    getCurrentUser, 
    sendOtp, 
    changePassword, 
    getUsers, 
    updateUser, 
    deleteUser 
} from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/', getUsers);
userRouter.post('/', saveUser);
userRouter.put('/:id', updateUser);

// 2. Add this DELETE route 👇
userRouter.delete('/:id', deleteUser); 

// ... keep existing routes
userRouter.post('/login', loginUser);
userRouter.post('/google', googleLogin);
userRouter.get('/current', getCurrentUser);
userRouter.post('/sendMail', sendOtp);
userRouter.post('/changePw', changePassword);

export default userRouter;