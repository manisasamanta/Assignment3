const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    otp: {
        type: String
    }
    ,
    otpExpires: {
        type: Date
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    image: {
        type: String

    }, // Store file path or URL

}, { timestamps: true, versionKey: false });

const userModel=mongoose.model('User', UserSchema);
module.exports=userModel