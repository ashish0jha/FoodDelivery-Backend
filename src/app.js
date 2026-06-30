const express = require("express");
require('dotenv').config();
const connectDB = require('./config/database');
const cors = require('cors');
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: process.env.FRONT_END_URL,
    credentials: true
}));

const authRouter = require("./routes/auth");
const restraRouter = require("./routes/restaurent");
const cartRouter = require("./routes/cart");

app.use("/",authRouter);
app.use("/",restraRouter);
app.use("/",cartRouter);


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
