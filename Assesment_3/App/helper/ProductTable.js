const nodemailer = require('nodemailer');
const productModel = require('../Models/ProductModel');


const getAllProducts = async () => {
    try {
        const products = await productModel.aggregate([
            {
                $lookup: {
                    from: 'categories', 
                    localField: 'category', 
                    foreignField: '_id', 
                    as: 'categoryInfo' 
                }
            },
            {
                $unwind: '$categoryInfo'
            },
            {
                $project: {
                    name: 1,
                    price: 1,
                    stock: 1,
                    'categoryInfo.name': 1 
                }
            }
        ]);

        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};


async function sendProductListEmail(userEmail) {
    try {
        const products = await getAllProducts();

        let productTable = `
            <h3>Product List</h3>
            <table border="1" cellpadding="5" cellspacing="0">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Stock</th>
                    </tr>
                </thead>
                <tbody>
        `;

        products.forEach(product => {
            const categoryName = product.categoryInfo.length > 0 ? product.categoryInfo[0].name : 'N/A';

            productTable += `
                <tr>
                    <td>${product.name}</td>
                    <td>${product.price}</td>
                    <td>${categoryName}</td>
                    <td>${product.stock}</td>
                </tr>
            `;
        });

        productTable += `
                </tbody>
            </table>
        `;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: 'Product List',
            html: productTable
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};


module.exports=sendProductListEmail

