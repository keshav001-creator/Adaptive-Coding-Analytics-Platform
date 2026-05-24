const express=require('express');

const route=express.Router();


route.post("/attempt", (req, res) => {

    console.log("Received Data:", req.body);

    res.json({
        message: "Data received successfully"
    });
});

module.exports=route;