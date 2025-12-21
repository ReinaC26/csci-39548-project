const mongoose = require('mongoose');
const express = require('express');
const Feedback = require('../models/Feedback');
const router = express.Router();

// Get all feedbacks
router.get('/', async (req, res) => {
    try {
        const feedbacks = await Feedback.find().populate('userId', 'username email');
        res.status(200).json({ success: true, feedbacks });
    } catch (error) {
        console.error('Error fetching feedbacks: ', error);
        res.status(500).json({ success: false, message: "Server error while fetching feedbacks" });
    }
});
// Get feedback by ID
router.get('/:id', async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id).populate('userId', 'username email');
        if (!feedback) {
            return res.status(404).json({ success: false, message: "Feedback not found" });
        }
        res.status(200).json({ success: true, feedback });
    } catch (error) {
        console.error('Error fetching feedback: ', error);
        res.status(500).json({ success: false, message: "Server error while fetching feedback" });
    }
});

// POST add new feedback
router.post('/', async (req, res) => {
    try {
        const { userId, rate, comment, image, questId} = req.body;

        // validate
        if (!userId || !rate || !comment) {
            return res.status(400).json({ success: false, message: "Please provide all required information." });
        }

        const feedback = new Feedback({
            userId,
            rate,
            comment,
            image,
            questId
        });

        await feedback.save();

        res.status(201).json({
            success: true,
            message: 'Feedback submitted successfully',
            feedback
        });
    } catch (error) {
        console.error('Feedback submission error: ', error);

        if (error.name == 'ValidationError') {
            const message = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ success: false, message: message.join('. ') });
        }

        res.status(500).json({ success: false, message: "Server error during feedback submission" });
    }
});

// Delete feedback by ID
router.delete('/:id', async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndDelete(req.params.id);
        if (!feedback) {
            return res.status(404).json({ success: false, message: "Feedback not found" });
        }
        res.status(200).json({ success: true, message: "Feedback deleted successfully" });
    } catch (error) {
        console.error('Error deleting feedback: ', error);
        res.status(500).json({ success: false, message: "Server error while deleting feedback" });
    }
});

module.exports = router;