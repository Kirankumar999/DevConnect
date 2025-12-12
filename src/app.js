const express = require('express');

const app = express();

app.use("/", (req, res) => {
    res.send("Dashboard");
});

app.use("/home", (req, res) => {
    res.send("This is Home page");
});
app.use("/test", (req, res) => {
    res.send("you are getting it from the srever");
});

app.listen(3900, ()=> {
    console.log("Server Started and listening to port 3900");
});