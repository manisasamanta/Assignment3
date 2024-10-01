const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const db = require('./App/config/DbConfig');

// Load environment variables from .env file
dotenv.config();
db();
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Static files
app.use(express.static(path.join(__dirname, 'Public')));
app.use('/Uploads', express.static(path.join(__dirname, 'Uploads')));



// Auth
const authrouter=require('./App/Routes/AuthRoute')
app.use(authrouter)

// user Route
const userRouter=require('./App/Routes/UserRoute')
app.use(userRouter)


// catgory Route

const CatgoryRoute=require('./App/Routes/CatgoryRoute')
app.use(CatgoryRoute)

// product Route

const ProductRoute=require('./App/Routes/ProductRoute')
app.use(ProductRoute)



const port = 3700
app.listen(port,()=>{
    console.log(`surver running at http://localhost:${port}`);
})
