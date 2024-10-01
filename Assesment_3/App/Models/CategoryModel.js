const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },

}, { timestamps: true, versionKey: false });

const categoryModel = mongoose.model('Category', CategorySchema);
 module.exports=categoryModel