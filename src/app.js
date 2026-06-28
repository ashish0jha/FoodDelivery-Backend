const express = require("express");

const app = express();

app.use("/",(req,res)=>{
    res.send("Hello from backend of Food Web app");
})

app.listen(8112,()=>{
    console.log("Server started at 8112")
})