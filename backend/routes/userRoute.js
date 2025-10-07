import express from 'express';
import authUser from '../middleware/authUser.js';
import { registerUser, loginUser, getProfile, getFavourites, addToFavourites, removeFromFavourites, updateProfile, verifyEmail, requestPasswordReset, resetPassword, resendVerificationEmail, changePassword } from '../controllers/usercontroller.js';
import upload from '../middleware/multer.js'

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/verify/:token', verifyEmail)
userRouter.post('/request-reset', requestPasswordReset)
userRouter.post('/reset/:token', resetPassword)
userRouter.post('/resend-verification', authUser, resendVerificationEmail);
userRouter.post('/change-password', authUser, changePassword);


userRouter.post('/update-profile', authUser, upload.single('image'), updateProfile);
userRouter.get('/get-profile', authUser, getProfile);

userRouter.get('/get-favourites', authUser, getFavourites);
userRouter.post('/add-favourite', authUser, addToFavourites);
userRouter.post('/remove-favourite', authUser, removeFromFavourites);

export default userRouter;