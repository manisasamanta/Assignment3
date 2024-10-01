

const express=require('express')

const upload = require('../../utils/userImage')
const UserController = require('../Controller/UserController')
const AuthCheck = require('../middleware/AuthCheck')


const userRoute=express.Router()

userRoute.post('/update/:id',AuthCheck,upload.single('image'),UserController.updateProfile)
userRoute.get('/user/profile',AuthCheck,UserController.showUser)


module.exports=userRoute