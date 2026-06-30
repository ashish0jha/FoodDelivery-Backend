const jwt = require('jsonwebtoken');
const User = require("../models/userschema");

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error("Login First")
        }
        const { _id } = await jwt.verify(token, process.env.FOOD_DELIVERY_TOKEN_KEY);

        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User not found");
        }
        req.user = user;
        next();
    }
    catch (err) {
        res.status(401).json({ message: err.message })
    }
}

module.exports = { userAuth };