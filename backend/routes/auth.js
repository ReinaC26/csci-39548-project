const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// JWT Token!!!
const generateToken = (userId) => {
    return jwt.sign(
        {userId}, 
        process.env.JWT_SECRET || 'some_secret_password_idk',
        {expiresIn: '7d'}
    );
};


// POST /api/auth/register
// user sign up
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // validate...
        if (! username || ! email || ! password) {
            return res.status(400).json({success: false, message: "Please provide all required information."});
        }

        // check for duplicate...
        const existingUser = await User.findOne({ $or: [{email}, {username}] });

        if (existingUser) {
            return res.status(409).json({ success: false, message: 'User with this email or username already exists.'});
        }

        // create new user...
        const user = new User({
            username, email, password // password hashed automatically
        });

        await user.save();

        // Token...
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: user.toJSON(),  // remove password from response
            token
        });
    } catch (error) {
        console.error('Registration error: ', error);

        if (error.name == 'ValidationError') {
            const message = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ success: false, message: message.join('. ')});

        }

        res.status(500).json({ success: false, message: "Server error during registration"});
    }
});

// POST /api/auth/login
// User Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        //validate...
        if (! email || ! password) {
            return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
        }

        // find by email...
        const user = await User.findOne({ email });
        if (! user) {
            return res.status(401).json({ success: false, message: "Invalid email or password."});
        }

        // check password
        const isPasswordValid = await user.comparePassword(password);
        if (! isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });

        }

        const token = generateToken(user._id);

        res.json({success: true, message: 'Login successful', user: user.toJSON(), token});
        
    } catch (error) {
        console.error('Login error: ', error);
        res.status(500).json({success: false, message: 'Server error during login'});
        
    }
});


// POST /api/auth/logout
// User logout
router.post()
