const express = require('express');
const authRouter = express.Router();
const validateSignUpRequest = require('../utils/validation');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { userAuth } = require('../middleWares/auth');

authRouter.post("/signup", async (req, res, next) => {
    try {
        validateSignUpRequest(req);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;

        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: req.body.password,
            emailId: req.body.emailId,
        });
        await user.save();
        res.status(201).send("User created successfully");
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
});
authRouter.post("/login", async (req, res) => {
    try {
        const {emailId, password} = req.body;
        // Validate
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            return res.status(404).json({ message: "Invalid Credentials" });
        }
        // Validate password
        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }
        // Generate a JWT token
        const token = await user.generateAuthToken();
        res.cookie("token", token,);
        res.status(200).json({ message: "Login successful", user: user });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
});

authRouter.post("/logout", userAuth, async (req, res) => {
    try {
        res.clearCookie("token");   
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ message: "Error logging out", error: error.message });
    }
});

authRouter.patch("/updatePassword", userAuth, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = req.user;
        const isPasswordValid = await user.validatePassword(oldPassword);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedNewPassword;
        await user.save();
        res.status(200).json({ message: "Password updated successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error updating password", error: error.message });
    }
});

module.exports = authRouter;