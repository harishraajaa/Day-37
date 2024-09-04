import express from "express"
import userController from "../Controller/user.controller.js"
const userrouter=express.Router()
import VerifyAuth from '../Middleware/verifyAuth.js'
import verifyAdmin from '../Middleware/verifyAdmin.js'

userrouter.get('/',(request,response)=>response.send({message:"user Data Fetched"}))
userrouter.get('/getAllUsers',VerifyAuth,verifyAdmin,userController.getAllUser)
userrouter.get('/getUserById/:id',VerifyAuth,verifyAdmin,userController.getUserById)
userrouter.post('/createUser',userController.createUser)
userrouter.post('/login',userController.login)
userrouter.post('/forgetpassword',userController.forgetPassword)
userrouter.put('/resetpassword/:id',userController.resetPassword)
userrouter.put('/changePassword',VerifyAuth,userController.changePassword)
userrouter.delete('/deleteUserById/:id',VerifyAuth,verifyAdmin,userController.deleteUserById)
userrouter.put('/editUserById/:id',VerifyAuth,verifyAdmin,userController.editUserById)

export default userrouter