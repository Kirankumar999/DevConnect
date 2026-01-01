const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://kbhaleka:unix1199@cafesagacluster.2ndzv8v.mongodb.net/DevConnect');
    } catch (error) {
        console.log("Error connecting to MongoDB");
        console.error(error);
    }
};

module.exports = connectDB; 