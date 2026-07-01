const { default: mongoose } = require("mongoose");

const paymentSchma = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    paymentId:{
        type:String
    },
    orderId:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        required:true,
    },
    amount:{
        type:Number,
        required:true,
    },
    currency:{
        type:String,
        required:true,
    },
    receipt:{
        type:String,
        required:true,
    },
    notes:{
        fullName:{
            type:String,
        },
        email:{
            type:String,
        }
    }
},{timestamps:true});

module.exports = mongoose.model("Payment",paymentSchma);