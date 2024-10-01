const sendProductListEmail = require("../helper/ProductTable");
const productModel = require("../Models/ProductModel")
const userModel = require("../Models/UserModel");


class productController {

    addProduct = async (req, res) => {

        try {
            const { name, price, category, stock } = req.body
            const addprod = await new productModel({
                name,
                price,
                category,
                stock
            })

            await addprod.save()

            return res.status(201).send({
                status: true,
                message: 'product added',
                data: addprod
            })

        } catch (err) {

            return res.status(500).send({
                status: false,
                message: err.message,

            })
        }


    }


    allProduct = async (req, res) => {
        try {
            const allProd = await productModel.find()

            return res.status(200).send({
                status: true,
                total: allProd.length,
                message: 'All product data',
                data: allProd
            })

        } catch (error) {
            return res.status(500).send({
                status: false,
                message: error.message,

            })
        }
    }


    updateProduct = async (req, res) => {
        try {

            const id = req.params.id
            let updateBody = req.body
            const updateProd = await productModel.findByIdAndUpdate(id, updateBody, { new: true })


            return res.status(201).send({
                status: true,

                message: 'All product data',
                data: updateProd
            })

        } catch (error) {
            return res.status(500).send({
                status: false,
                message: error.message,

            })
        }
    }


    // product  list which stock lessthan equal 1

    productStock = async (req, res) => {
        try {
            const stocklessthanOne = await productModel.aggregate([
                {
                    $match: {
                        "stock": { $lte: 1 }
                    }
                }
            ])

            return res.status(200).send({
                status: true,
                total: stocklessthanOne.length,
                message: 'All product stock less than equal 1',
                data: stocklessthanOne
            })

        } catch (error) {
            return res.status(500).send({
                status: false,
                message: error.message,

            })
        }
    }


    // delete 

    deleteProduct = async (req, res) => {
        try {
            const id = req.params.id
            const delteprod = await productModel.findByIdAndDelete(id)

            return res.status(200).send({
                status: true,

                message: 'Delete successful',
                data: delteprod
            })

        }
        catch (error) {
            return res.status(500).send({
                status: false,
                message: error.message,

            })
        }
    }


    // send product list in table format to user Email
    sendProductList = async (req, res) => {
        try {
            const id = req.user._id;
            const email = req.user.email;
    
            const user = await userModel.findById(id);
    
            if (!user) {
                return res.status(500).send({
                    status: false,
                    message: 'User not found'
                });
            } else {
              
    
                return res.status(200).send({
                    status: true,
                    message: 'Product list successfully sent to user email',
                 
                });
            }
        } catch (err) {
            return res.status(500).send({
                status: false,
                message: err.message,
            });
        }
    }
    


}
module.exports = new productController()