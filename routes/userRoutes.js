import express from 'express'
import {regUser, loginUser, userCredit} from '../controllers/userControllers.js'
import userAuth from '../middleware/auth.js'

const userRouter= express.Router()

userRouter.post('/register', regUser)
userRouter.post('/login', loginUser)
userRouter.get('/credits',userAuth, userCredit)

export default userRouter
