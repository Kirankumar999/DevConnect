const userAuth  = (req, res, next) => {
    console.log("isAuthorized middleware");
    const token = "1234567890";
    if (token !== "1234567890") {
        return res.status(401).json({ message: "Unauthorized" });
    }
    next();
};

module.exports = userAuth;