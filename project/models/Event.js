const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Event name is required'],
        trim: true,
        minlength: [2, 'Event name must be at least 2 characters long'],
        maxlength: [100, 'Event name must be at most 100 characters long']
    },
    sport: {
        type: String,
        required: [true, 'Sport is required'],
        trim: true,
        minlength: [2, 'Sport must be at least 2 characters long'],
        maxlength: [50, 'Sport must be at most 50 characters long']
    },
    date: {
        type: Date,
        required: [true, 'Date is required'],
        validate: {
            validator: (value) => !Number.isNaN(new Date(value).getTime()),
            message: 'Invalid event date'
        }
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true,
        minlength: [2, 'Location must be at least 2 characters long'],
        maxlength: [120, 'Location must be at most 120 characters long']
    },
    maxParticipants: {
        type: Number,
        required: [true, 'Max participants is required'],
        min: [1, 'Max participants must be at least 1'],
        max: [100000, 'Max participants must be at most 100000']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
