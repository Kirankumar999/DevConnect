const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../middleWares/auth');

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.send(user);
    } catch (error) {
        res.status(500).json({ message: "Error getting profile", error: error.message });
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        validateProfileEditRequest(req);

        Object.keys(req.body).forEach(key => {
            req.user[key] = req.body[key];
        });
        await req.user.save();
        res.status(200).json({ message: " ${req.user.firstName} ${req.user.lastName} Profile edited successfully", user: req.user });   
    } catch (error) {
        res.status(500).json({ message: "Error editing profile", error: error.message });
    }       
});

module.exports = profileRouter;