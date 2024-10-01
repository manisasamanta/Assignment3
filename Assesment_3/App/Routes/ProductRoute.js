
const express=require('express')
const ProductController = require('../Controller/ProductController')
const AuthCheck = require('../middleware/AuthCheck')

const productRouter=express.Router()

productRouter.post('/add-product',AuthCheck,ProductController.addProduct)

productRouter.post('/update-product/:id',AuthCheck,ProductController.updateProduct)
productRouter.get('/all-product',AuthCheck,ProductController.allProduct)

productRouter.get('/all-product-stock',AuthCheck,ProductController.productStock)
productRouter.get('/product-list-send-email',AuthCheck,ProductController.sendProductList)

module.exports=productRouter