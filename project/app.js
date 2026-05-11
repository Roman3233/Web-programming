require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Sports Events API is running'
    });
});

app.use('/api/auth', authRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

if (!mongoUri) {
    console.error('MongoDB connection error: set MONGO_URI or MONGODB_URI in .env');
    process.exit(1);
}

mongoose.connect(mongoUri)
    .then(() => {
        console.log('MongoDB connected');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    });
