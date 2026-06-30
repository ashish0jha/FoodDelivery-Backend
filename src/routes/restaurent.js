const express = require("express");
const Restaurent = require("../models/RestaurentSchema");
const individualResSchema = require("../models/individualResSchema");

const restraRouter = express.Router();

restraRouter.get("/homePage/restaurent", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 12;
        const skip = (page - 1) * limit;

        const restaurent = await Restaurent.find({}).skip(skip).limit(limit);
        const total = await Restaurent.countDocuments();

        res.json({
            restaurent,
            hasMore: skip + restaurent.length < total,
        })
    }
    catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
})

restraRouter.post("/check",async(req,res)=>{
    try{
        const {resId, name , rating , totalRatings , costForTwo , cuisines , areaName , timeToReach , menu} = req.body;

        const check = new individualResSchema({
            resId,
            name,
            rating,
            totalRatings,
            costForTwo,
            cuisines,
            areaName,
            timeToReach,
            menu
        })

        await check.save();
        res.send("done");
    }
    catch(err) {
        res.status(400).send("EROOR : " + err.message)
    }
})

module.exports = restraRouter;