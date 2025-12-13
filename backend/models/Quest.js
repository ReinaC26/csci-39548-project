const mongoose = require('mongoose');

const questSchema = new mongoose.Schema({
    distance: String,
    duration: String,
    startLocation: String,
    endLocation: String,
    description: String,
    questGoal: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quest', questSchema);