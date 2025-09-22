import express from 'express'
import {registerUser, loginUser, logoutUser, sendVerifyOtp, verifyEmail, isAuthenticated, resetOtp, resetPassword } from '../controllers/authController.js'
import userAuth from '../middlewares/userAuth.js'

const authRouter = express.Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/logout', logoutUser);
authRouter.post('/sendverifyotp',userAuth, sendVerifyOtp);
authRouter.post('/verifyemail',userAuth, verifyEmail);
authRouter.post('/isauth',userAuth, isAuthenticated);
authRouter.post('/resetotp', resetOtp);
authRouter.post('/resetpassword', resetPassword);

export {authRouter};