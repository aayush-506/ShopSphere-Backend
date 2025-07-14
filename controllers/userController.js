import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

// Generate JWT token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '3d' });
};


// Route: Register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // ✅ Log the incoming body to debug
        console.log("Incoming registration data:", { name, email, password });

        // Basic field presence check
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Check if user already exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Validate email
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }

        // Validate password length
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
        }

        // Hash password and save user
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
        const newUser = new userModel({ name, email, password: hashed });
        const user = await newUser.save();

        const token = createToken(user._id);
        return res.status(201).json({ success: true, token });

    } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};


// Route: Login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const token = createToken(user._id);
        res.json({ success: true, token });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Route: Admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await userModel.findOne({ email });
       if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
        const token = jwt.sign(email+password,process.env.JWT_SECRET)
        res.json({success:true,token})
       }
       else{
        res.json({success:false,message:"invalid credentials"})
       }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export default { loginUser, registerUser, adminLogin };
