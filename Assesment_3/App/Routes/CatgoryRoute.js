

const express=require('express')
const CatgoryController = require('../Controller/CatgoryController')
const AuthCheck = require('../middleware/AuthCheck')

const categoryRoute=express.Router()

categoryRoute.post('/add/category',AuthCheck,CatgoryController.addCategory)

categoryRoute.get('/all-category-withProduct',AuthCheck,CatgoryController.getCategoriesWithProducts)


module.exports=categoryRoute