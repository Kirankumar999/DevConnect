    const express = require('express');
    const cookieParser = require('cookie-parser');
    const app = express();
    const connectDB = require('./config/database');
    app.use(express.json());
    app.use(cookieParser());
    const authRouter = require('./routes/auth');
    const profileRouter = require('./routes/profile');
    const requestRouter = require('./routes/request');
    const userRouter = require('./routes/user');

    app.use("/", authRouter);
    app.use('/', profileRouter);
    app.use('/', requestRouter);
    app.use('/', userRouter);

    connectDB().then(() => {
        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    }).catch((err) => {
        console.error("Failed to start server:", err);
        process.exit(1);
    });

module.exports = app;