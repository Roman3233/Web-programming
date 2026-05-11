const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Event name is required'],
        trim: true
    },
    sport: {
        type: String,
        required: [true, 'Sport is required'],
        trim: true
    },
    date: {
        type: Date,
        required: [true, 'Date is required']
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true
    },
    maxParticipants: {
        type: Number,
        required: [true, 'Max participants is required'],
        min: [1, 'Max participants must be at least 1']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
