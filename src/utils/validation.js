const validator = require('validator');
const User = require("../models/userschema");

const signUpValidation = async (req) => {
    const { fullName, email, password } = req.body;
    if (!validator.isAlpha(fullName, "en-US", { ignore: " " })) {
        throw new Error("Enter the Valid Name");
    }
    const user = await User.findOne({ email: email });
    if (user) {
        throw new Error("User already Exist with this email");
    }
    if (!validator.isEmail(email)) {
        throw new Error("Enter the correct Email");
    }
    if (!validator.isStrongPassword(password)) {
        throw new Error("Enter the Strong Password")
    }
}

const validateLoginData = (req) => {
    const { email, password } = req.body;
    if(!email || !password){
        throw new Error("Enter all fields")
    }
    if(!validator.isEmail(email)){
        throw new Error("Enter the correect Email");
    }
    if(!validator.isStrongPassword(password)){
        throw new Error("Password is Wrong");
    }
}

module.exports = { signUpValidation, validateLoginData }