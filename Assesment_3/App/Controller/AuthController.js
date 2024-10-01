const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken')
const userModel = require('../Models/UserModel');
const sendOTP = require('../helper/NodeMailer');
const { generateOTP, generateOTPExpiry } = require('../helper/otpGenerate'); // Adjust the path as necessary


class AuthController {

    Register = async (req, res) => {
        try {
            const { name, email, password, password_confirmation } = req.body;
            console.log('Request Body:', req.body);
    
            // Check if password and password_confirmation match
            if (password !== password_confirmation) {
                return res.status(400).json({
                    status: "failed",
                    message: "Password and Confirm Password don't match"
                });
            }
    
            // Check if email already exists
            const existingUser = await userModel.findOne({ email: email });
            if (existingUser) {
                return res.status(409).json({
                    status: "failed",
                    message: "Email already exists"
                });
            }
    
            // Generate OTP and expiration time
            const otp = generateOTP();
            const otpExpires = generateOTPExpiry();
    
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);
    
            // Create a new user instance
            const newUser = new userModel({
                name,
                email,
                password: hashedPassword,
                otp,              // Store the generated OTP
                otpExpires        // Store the expiration time of the OTP
            });
    
            // If the user has uploaded an image, add it to the user profile
            if (req.file) {
                newUser.image = req.file.path;
            }
    
            // Save the user to the database
            await newUser.save();
    
            // Send OTP via email
            try {
                await sendOTP(email, otp);  // Ensure sendOTP is correctly implemented
            } catch (emailError) {
                console.error('Error sending OTP:', emailError.message);
                return res.status(500).send('Error sending OTP. Please try again later.');
            }
    
            return res.status(201).json({
                status: "success",
                message: "Registration successful, OTP sent to your email",
                user: newUser
            });
    
        } catch (error) {
            console.error('Registration Error:', error);  // Log the full error object
            return res.status(500).json({
                success: false,
                message: 'Unable to register'
            });
        }
    };
    
    

    verifyOTP = async (req, res) => {
        try {
            const { email, otp } = req.body;
            const user = await userModel.findOne({ email });
            
            if (!user) {
                return res.status(500).send('User not found.');
            }
    
            // Debug logs
            console.log("Stored OTP:", user.otp);
            console.log("Entered OTP:", otp);
            console.log("Current Time:", Date.now());
            console.log("OTP Expiry Time:", user.otpExpires);
    
            if (user.otp !== otp) {
                return res.status(500).send('Invalid OTP.');
            }
    
            if (user.otpExpires < Date.now()) {
                return res.status(500).send('OTP has expired.');
            }
    
            // If OTP matches and is not expired
            user.isVerified = true;
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save();
    
            return res.status(200).json({
                status: true,
                message: 'OTP successfully verified'
            });
    
        } catch (err) {
            return res.status(500).send(err.message);
        }
    }
    
   
    
     login = async (req, res) => {
        try {
            const { email, password } = req.body;
    
            // Check if user exists
            const user = await userModel.findOne({ email });
            if (!user) {
                return res.status(404).json({ status: false, message: "Invalid Email or Password" });
            }
    
            // Check if user is verified
            if (!user.isVerified) {
                return res.status(401).json({ status: false, message: "Your account is not verified" });
            }
    
            // Check if password is valid
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({ status: false, message: "Invalid email or password" });
            }
    
            // Generate token
            const token = jwt.sign({
                _id: user._id,
                name: user.name,
                email: user.email,
                image: user.image
            }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
            return res.status(200).json({
                status: true,
                message: "Login successfully",
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    image: user.image
                },
                token,
            });
    
        } catch (error) {
            console.error('Login Error:', error.message); // Log the error message for debugging
            return res.status(500).json({ status: false, message: "Server Error" });
        }
    };
    
    
    




}


module.exports = new AuthController()

