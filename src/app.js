const express = require("express");
require('dotenv').config();
const connectDB = require('./config/database');
const cors = require('cors');
const User = require("./models/userschema");
const Restaurent = require("./models/RestaurentSchema")

const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:1234",
    credentials: true
}));

app.get("/homePage/restaurent", async (req, res) => {
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

app.post("/signup", async (req, res) => {
    try {
        const data = req.body;

        const user = new User(req.body);

        const SavedUSer = await user.save();

        console.log(SavedUSer);
        res.send("Hello from backend of Food Web app");
    }
    catch (err) {
        res.status(400).send("ERROR : " + err.message)
    }
})

connectDB()
    .then(() => {
        console.log("DB Connected");
        app.listen(process.env.PORT, () => {
            console.log("Server started at " + process.env.PORT)
        })
    })
    .catch((err) => {
        console.log("DB not Connected");
    })
