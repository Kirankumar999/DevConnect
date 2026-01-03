const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require('../middleWares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        const allowedStatuses = ['interested', 'ignored'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }
        if (fromUserId.toString() === toUserId.toString()) {
            return res.status(400).json({ message: "You cannot send a connection request to yourself" });
        }
        const isToUserIdValid = await User.findById(toUserId);
        if (!isToUserIdValid) {
            return res.status(400).json({ message: "User Not Found" });
        }
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },
            ],
        });
        if (existingConnectionRequest) {
            return res.status(400).json({ message: "Connection request already exists" });
        }
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });
        await connectionRequest.save();
        res.status(200).json({
            message: req.user.firstName + "is" + req.user.status + "in" + req.user.lastName, 
            connectionRequest: connectionRequest
        });
    } catch (error) {
        res.status(500).json({ message: "Error sending connection request", error: error.message });
    }
});

requestRouter.post("/request/send/ignored/:userID", userAuth, async (req, res) => {
    try {
        const user = req.user;
        const { userID } = req.params;
    } catch (error) {
        res.status(500).json({ message: "Error sending ignored request", error: error.message });
    }
});

requestRouter.post("/request/review/accepted/:requestId", userAuth, async (req, res) => {
    try {
        const user = req.user;
        const { requestId } = req.params;
    } catch (error) {
        res.status(500).json({ message: "Error reviewing accepted request", error: error.message });
    }
});

module.exports = requestRouter;