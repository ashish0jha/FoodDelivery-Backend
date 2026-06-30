const mongoose = require('mongoose');
const { isLowercase } = require('validator');

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:50,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        isLowercase:true
    },
    password:{
        type:String,
        required:true,
    },
    address:{
        type:String,
    },
    photoUrl:{
        type:String,
    }
});

module.exports = mongoose.model('user',userSchema);