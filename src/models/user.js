const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    password: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    emailId: {
        type: String,
        unique: true,
        required: true,
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
    },  
    profilePicture: {
        type: String,
    },
    bio: {
        type: String,
    },
    skills: {
        type: Array,
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;