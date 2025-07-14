import express from 'express'
import userController from "../controllers/userController.js";

const { loginUser, registerUser, adminLogin } = userController;


const userRouter= express.Router();

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/admin',adminLogin)

export default userRouter