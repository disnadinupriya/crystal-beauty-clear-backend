import express from 'express';
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

// --- CRUD Routes ---
userRouter.get('/', getUsers);            // Get all users
userRouter.post('/', saveUser);           // Create/Register user
userRouter.put('/:id', updateUser);       // Update user
userRouter.delete('/:id', deleteUser);    // Delete user (Fixed: Added this line)

// --- Auth & Utility Routes ---
userRouter.post('/login', loginUser);
userRouter.post('/google', googleLogin);
userRouter.get('/current', getCurrentUser);
userRouter.post('/sendMail', sendOtp);
userRouter.post('/changePw', changePassword);

export default userRouter;