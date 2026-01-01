const express = require('express');
const app = express();
const connectDB = require('./config/database');

const User = require('./models/user');

app.use(express.json());

app.post("/signup", async (req, res) => {
    console.log(req.body);
    const userOBJ = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        phoneNumber: req.body.phoneNumber,
        emailId: req.body.emailId
    };
    const user = new User(userOBJ);
    await user.save();
    res.send("User created successfully");
});

app.get("/user/:id", async (req, res) => {
    const user = await User.findById(req.params.id);
    res.send(user);
});

app.delete("/user/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        res.send(user);
    } catch (error) {
        res.status(500).json({ message: "Error deleting user" });
    }
    res.send(user);
});

app.get("user", async (req, res) => {
    try {
    const users = await User.findOne({ emailId: req.body.emailId });
    if (!users) {
            return res.status(404).json({ message: "User not found" });
        }
        res.send(users);
    } catch (error) {
        res.status(500).json({ message: "Error finding user" });
    }
});

app.patch("/user/:id", async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndUpdate(userId, req.body);
        res.send(user);
    } catch (error) {
        res.status(500).json({ message: "Error updating user" });
    }
});

app.put("/user/:id", async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndUpdate(userId, req.body);
        res.send(user);
    } catch (error) {
        res.status(500).json({ message: "Error updating user" });
    }
});

connectDB().then(() => {
    console.log("Connected to MongoDB");
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
}).catch((err) => {
    console.log("Error connecting to MongoDB");
    console.error(err);
});

