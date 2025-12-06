// user profile endpoints 

const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (! token ) {
        return res.status(401).json({ success: false, message: 'Access token required'});

    }
    jwt.verify(token, process.env.JWT_SECRET || 'blah', (err, decoded) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Invalid token'});
        }
        req.userId = decoded.userId;
        next();

    });
};

// GET /api/users/profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('friends', 'username avatar');
        if ( ! user) {
            return res.status(404).json({ success: false, message: 'User not found'});

        }
        res.json({ success: true, user: user.toJSON()});
    } catch (error) {
        console.error('error getting profile: ', error);
        res.status(500).json({ success: false, message: 'Server error'});

    }

});

// PUT /api/users/profile 
// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const { username, email, bio } = req.body;

        const user = await User.findById(req.userId);
        if (! user) {
            return res.status(404).json({success: false, message: 'User not found'});
        }

        if (username) user.username = username;
        if (email) user.email = email;
        if (bio !== undefined) user.bio = bio;

        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: user.toJSON()
        });
    } catch (error) {
        console.error('Error with updating profile: ', error);

        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: 'Username or email alreadu exists'});
        }
        res.status(500).json({ success: false, message: "Server error" });

    }
});

// GET /api/users/friends
// friend list
router.get('/friends', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('friends', 'username avatar questsCompleted');
    

        if (! user) {
            return res.status(404).json({ success: false, message: 'User not found'});
        }
        res.json({ success: true, friends: user.friends });
    } catch (error) {
        console.error('Error retrieving friends: ', error);
        res.status(500).json({ success: false, message: 'Server error'});
    }
});

module.exports = router;