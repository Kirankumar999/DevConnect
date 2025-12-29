const express = require('express');

const app = express();

app.get("/users", (req, res, next) => {
    res.send("Users Page");
}, (req, res) => {
    
});

app.use("/", (req, res) => {
    res.send("Dashboard");
});
// User Routes - GET, POST, PUT, DELETE, PATCH

// GET /user/:id - get user by id
app.get("/user/:id", (req, res) => {
    const userId = req.params.id;
    // Dummy response, replace with DB access as needed
    res.send(`Getting user with ID: ${userId}`);
});

// POST /user - create a new user
app.post("/user", (req, res) => {
    // Normally, you'd access req.body for posted data
    res.send("User created (dummy response)");
});

// PUT /user/:id - update user fully
app.put("/user/:id", (req, res) => {
    const userId = req.params.id;
    // Normally, you'd update user data in DB here
    res.send(`Full update for user with ID: ${userId}`);
});

// PATCH /user/:id - update user partially
app.patch("/user/:id", (req, res) => {
    const userId = req.params.id;
    // Normally, you'd update parts of the user in DB here
    res.send(`Partial update for user with ID: ${userId}`);
});

// DELETE /user/:id - delete a user
app.delete("/user/:id", (req, res) => {
    const userId = req.params.id;
    // Normally, you'd delete the user from DB here
    res.send(`Deleted user with ID: ${userId}`);
});

app.listen(3800, ()=> {
    console.log("Server Started and listening to port 3800");
});