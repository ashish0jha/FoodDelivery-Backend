const { default: mongoose } = require("mongoose");

const itemSchema = new mongoose.Schema({
    id:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
        minLength:4,
    },
    price:{
        type:Number,
        min:0,
        max:10000,
    },
    rating:{
        type:Number,
        min:0,
        max:5
    },
    ratingCount:{
        type:Number,
        min:0
    },
    description:{
        type:String,
    },
    image:{
        type:String,
    }
},{_id:false})

const menuSchema = new mongoose.Schema({
    category:{
        type:String,
        required:true
    },
    items:[itemSchema]
},{_id:false})

const individualResSchema = new mongoose.Schema({
    resId:{
        type:String,
        required:true,
        unique:true,
    },
    name:{
        type:String,
        required:true,
    },
    rating:{
        type:Number,
        min:0,
        max:5,
    },
    totalRatings:{
        type:String,
    },
    costForTwo:{
        type:String,
    },
    cuisines:{
        type:[String],
    },
    areaName:{
        type:String,
    },
    timeToReach:{
        type:String,
    },
    menu:{
        type:[menuSchema]
    }
},{timestamps:true})

module.exports = mongoose.model("individualRes",individualResSchema)