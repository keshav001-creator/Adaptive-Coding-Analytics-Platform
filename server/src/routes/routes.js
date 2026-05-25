const express=require('express');
const generateResponse=require("../AIService");
const route=express.Router();
const {logAttempt}=require("../controller/attempt.controller");


route.post("/attempt",logAttempt);
module.exports=route;