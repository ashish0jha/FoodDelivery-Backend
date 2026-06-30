const express = require("express");
const { signUpValidation, validateLoginData } = require("../utils/validation");
const User = require("../models/userschema");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { userAuth } = require("../middlewares/auth")

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
    try {
        await signUpValidation(req);

        const { fullName, email, password } = req.body;

        const hashPassword = await bcrypt.hash(password, 10);

        const user = new User({
            fullName,
            email,
            password: hashPassword
        })

        const savedUser = await user.save();

        const token = await jwt.sign({ _id:savedUser._id }, process.env.FOOD_DELIVERY_TOKEN_KEY);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            expires: new Date(Date.now() + 8 * 3600 * 1000)
        });

        res.json({
            msg: "User Registered Successfully",
            savedUser
        })

    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }
})

authRouter.post("/login", async (req, res) => {
    try {
        validateLoginData(req);

        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("User does not exist");
        }
        const { _id, fullName } = user;
        const isCorrectPassword = await bcrypt.compare(password, user.password);

        if (!isCorrectPassword) {
            throw new Error("Password is Wrong");
        }
        const token = await jwt.sign({ _id }, process.env.FOOD_DELIVERY_TOKEN_KEY);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            expires: new Date(Date.now() + 8 * 3600 * 1000)
        });

        res.json({ message: "Login Sucessfull", fullName })
    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }
})

authRouter.post("/logout", async (req, res) => {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now())
        })
        res.json({ message: "Logout Successfull" })
    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }
})


authRouter.get("/checklogin", userAuth , (req,res)=>{
    try{
        const user = req.user;
        if(!user){
            throw new Error("Please Login First");
        }
        res.json({
            message:"Logged In",
            fullName:user.fullName,
        })
    }
    catch(err){
        res.status(400).json({message:err.message})
    }
})


module.exports = authRouter;