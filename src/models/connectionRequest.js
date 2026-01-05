const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    status: {
        type: String,
        enum: {
            values: ['pending', 'accepted', 'rejected', 'interested'],
            message: 'Invalid status',
        },
        default: 'pending',
        required: true,
    },
}, { timestamps: true });


connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

// connectionRequestSchema.pre('save', function(next) {
//     const connectionRequest = this;
//     if (connectionRequest.fromUserId.toString() === connectionRequest.toUserId.toString()) {
//         throw new Error('You cannot send a connection request to yourself - Coming from the pre save hook');
//     }
//     next();
// });

const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema);   
module.exports = ConnectionRequest;