const mongoose = require('mongoose');

const userQuestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    quest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quest',
        required: true
    },
    completedAt: {
        type: Date,
        default: Date.now
    },
    isFavorite: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
module.exports = mongoose.model('UserQuest', userQuestSchema);