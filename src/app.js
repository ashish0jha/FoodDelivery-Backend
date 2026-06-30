const express = require("express");
require('dotenv').config();
const connectDB = require('./config/database');
const cors = require('cors');
const authRouter = require("./routes/auth");
const restraRouter = require("./routes/restaurent");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:1234",
    credentials: true
}));

app.use("/",authRouter);
app.use("/",restraRouter);


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
