const categoryModel = require("../Models/CategoryModel");

class categoryController{

addCategory=async(req,res)=>{
    try{

        const adddata=new categoryModel({
            name:req.body.name
        })
        await adddata.save()

        return res.status(201).send({
            status:true,
            message:'data added',
            data:adddata
        })
        
    }catch(err){
        return res.status(500).send(err.message);
    }
}


 getCategoriesWithProducts = async (req,res) => {
    try {
        const categories = await categoryModel.aggregate([
            {
                $lookup: {
                    from: 'products', 
                    localField: '_id',
                    foreignField: 'category',
                    as: 'products'
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    totalProducts: { $size: '$products' },
                    products: 1
                }
            }
        ]);

        return res.status(200).json({
            status:true,
            total:categories.length,
            message:'List of categories with total number of products and list of products for that category ',
            data:categories
        })
    } catch (error) {
        console.error('error while showing category products', error);
        throw error;
    }
};


}
module.exports=new categoryController()