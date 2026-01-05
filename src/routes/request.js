const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require('../middleWares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

// Send a connection request
// Status can be interested or ignored
// ToUserId is the id of the user to send the connection request to
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
            message: req.user.firstName + "  is  " + status + "  in " + "Lucy's" + "Profile", 
            connectionRequest: connectionRequest
        });
    } catch (error) {
        res.status(500).json({ message: "Error sending connection request", error: error.message });
    }
});

// Review a connection request
// Status can be accepted or rejected
// RequestId is the id of the connection request
requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        
        const user = req.user;
        const { status, requestId } = req.params;
        const allowedStatuses = ['accepted', 'rejected'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }
        const connectionRequest = await ConnectionRequest.findById({
            _id: requestId,
            toUserId: user._id,
            status: 'interested',
        });
        if (!connectionRequest) {   
            return res.status(400).json({ message: "Connection request not found" });
        }
        if (connectionRequest.toUserId.toString() !== user._id.toString()) {
            return res.status(400).json({ message: "You are not authorized to review this connection request" });
        }
        
        connectionRequest.status = status;
        await connectionRequest.save();
        res.status(200).json({ message: "Connection request reviewed successfully", connectionRequest: connectionRequest });
    } catch (error) {
        res.status(500).json({ message: "Error reviewing accepted request", error: error.message });
    }
});

module.exports = requestRouter;