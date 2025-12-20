// user profile endpoints 

const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const UserQuest = require('../models/UserQuest');
const Quest = require('../models/Quest');
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

// GET /api/users/quests
// Get user's completed quests (w/ filtering)
router.get('/quests', authenticateToken, async (req, res) => {
    try {
        const { filter = 'all '} = req.query;

        //build filter query
        let matchQuery = { user: req.userId };

        if (filter === 'week') {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            matchQuery.completedAt = { $gte: weekAgo };
        } else if (filter === 'month') {
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() -1);
            matchQuery.completedAt = { $gte: monthAgo };
        } else if (filter === 'favorites') {
            matchQuery.isFavorite = true;
        }

        const quests = await UserQuest.find(matchQuery)
            .populate('quest')
            .sort({ completedAt: -1 })
            .limit(10);
        res.json({
            success: true,
            quests
        });
    } catch (error) {
        console.error('Error retrieving user quests: ', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// POST /api/users/quest/:questId/complete
// Mark a quest as completed
router.post('/quests/:questId/complete', authenticateToken, async (req, res) => {
    try {
        const { questId } = req.params;

        // check if quest exists...
        const quest = await Quest.findById(questId);
        if (!quest) {
            return res.status(404).json({ success: false, message: 'Quest not found'});

        }
        // check if quest already completed this quest
        const existingCompletion = await UserQuest.findOne({
            user: req.userId,
            quest: questId
        });

        if (existingCompletion) {
            return res.status(409).json({
                success: false,
                message: 'Quest already completed'
            });
        }

        // create new completion record..
        const userQuest = new UserQuest({ 
            user: req.userId,
            quest: questId
        });

        await userQuest.save();

        //update user quest count..
        const user = await User.findById(req.userId);
        user.questsCompleted += 1;
        await user.save();

        res.json({ 
            success: true,
            message: 'Quest completed successfully!',
            userQuest
        });
    } catch(error) {
        console.error('Error completing quest: ', error);
        res.status(500).json({ success: false, message: 'Server error'})
    }
});

module.exports = router;