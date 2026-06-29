const mongoose = require('mongoose');

const restaurentSchema = new mongoose.Schema({
    resId:{
        type:String,
        required:true,
    },
    name:{
        type:String,
    },
    imageId:{
        type:String,
    },
    rating:{
        type:Number,
    },
    timeToReach:{
        type:String,
    },
    cuisines:{
        type:[String],
    }
});

module.exports = mongoose.model("restaurent",restaurentSchema);