const express=require('express');
const generateResponse=require("../AIService");
const route=express.Router();
const {logAttempt,getQuestionLogs,getQuestionByName,getGlobalAnalysis}=require("../controller/attempt.controller");


route.post("/attempt",logAttempt);
route.get("/questions",getQuestionLogs);
route.get("/questions/:questionName",getQuestionByName);
route.get("/ai-analysis", getGlobalAnalysis);


module.exports=route;