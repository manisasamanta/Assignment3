
const express=require('express')

const AuthController = require('../Controller/AuthController')
const uploadProduct = require('../../utils/userImage')


const authroute=express.Router()

authroute.post('/signup',uploadProduct.single('image'),AuthController.Register)
authroute.post('/verfiy-otp',AuthController.verifyOTP)
authroute.post('/login',AuthController.login)

module.exports=authroute