const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://kbhaleka:unix1199@cafesagacluster.2ndzv8v.mongodb.net/DevConnect';
        await mongoose.connect(mongoURI);
        console.log("MongoDB connection established");
    } catch (error) {
        console.log("Error connecting to MongoDB");
        console.error(error);
        throw error; // Re-throw to reject the promise
    }
};

module.exports = connectDB; 