const express = require('express');
const userRouter = express.Router();
const { userAuth } = require('../middleWares/auth');
const User = require('../models/user');
const ConnectionRequest = require('../models/connectionRequest');

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const user = req.user;
        const isloggedinUser = await User.findById(user._id.toString());
        if (!isloggedinUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const connections = await ConnectionRequest.find(
            {
                $or: [
                    { toUserId: user._id.toString(), status: 'accepted' },
                    { fromUserId: user._id.toString(), status: 'accepted' }
                ]
            }).populate('fromUserId', 'firstName lastName profilePicture').select('fromUserId status');
        if (!connections) {
            return res.status(404).json({ message: "No connections found" });
        }

        console.log(connections);
        res.status(200).json({ message: "Connections fetched successfully", connections });
    } catch (error) {
        res.status(500).json({ message: "Error getting connections", error: error.message });
    }
});

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const user = req.user;
        const requests = await ConnectionRequest.find({ toUserId: user._id, status: 'interested' });
        res.status(200).json({ message: "Requests fetched successfully", requests });
    } catch (error) {
        res.status(500).json({ message: "Error getting requests", error: error.message });
    }
});

userRouter.get("/user/requests/sent", userAuth, async (req, res) => {
    try {
        const user = req.user;
        const requests = await ConnectionRequest.find({ fromUserId: user._id, status: 'interested' });
        res.status(200).json({ message: "Requests fetched successfully", requests });
    } catch (error) {
        res.status(500).json({ message: "Error getting requests", error: error.message });
    }
});

userRouter.get("/user/feeds", userAuth, async (req, res) => {
    try {
        const user = req.user;
        const isloggedinUser = await User.findById(user._id.toString());
        if (!isloggedinUser) {
            return res.status(404).json({ message: "User not found" });
        }
        // Pagination logic
        // Get page and limit from query params, set default values if not provided
        let { page = 1, limit = 10 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        // Calculate skip value
        const skip = (page - 1) * limit;

        // Get total feeds count for the logged in user
        const totalFeeds = await ConnectionRequest.countDocuments({ toUserId: req.user._id });

        // Fetch paginated feeds
        const feeds = await ConnectionRequest.find({ toUserId: req.user._id })
            .skip(skip)
            .limit(limit)
            .populate('fromUserId', 'firstName lastName profilePicture');

        // Add pagination info to response
        res.status(200).json({
            message: "Feeds fetched successfully",
            feeds,
            pagination: {
                total: totalFeeds,
                page,
                limit,
                totalPages: Math.ceil(totalFeeds / limit)
            }
        });
        return;
    } catch (error) {
        res.status(500).json({ message: "Error getting feeds", error: error.message });
    }
});

module.exports = userRouter;