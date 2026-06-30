const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String
    },
    rating:{
        type:Number,
        min:0,
        max:5,
    },
    ratingCount:{
        type:Number,
        min:0,
    },
    description:{
        type:String,
    },
    qty: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    }
}, { _id: false });

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
        unique: true
    },
    items: {
        type: [cartItemSchema],
        default: []
    }
}, { timestamps: true });

module.exports = mongoose.model("Cart", cartSchema);