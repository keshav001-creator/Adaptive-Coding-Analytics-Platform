const questionLogModel=require("../db/model");
const logIntelligence=require("../service/intelligence.service");
const generateResponse=require("../AIService");



async function logAttempt(req, res) {

    console.log("Received Data:", req.body);

    try {

        const questionExits=await questionLogModel.findOne({ question: req.body.question }).sort({revisionNumber: -1 });

        if(questionExits){

            await questionLogModel.create({
                question: req.body.question,
                timeSpent: req.body.timeSpent,
                failedAttempts: req.body.failedAttempts,
                revisionNumber: questionExits.revisionNumber + 1
            })

        
        }else{
            await questionLogModel.create({
            question: req.body.question,
            timeSpent: req.body.timeSpent,
            failedAttempts: req.body.failedAttempts 
        });
        }

        const behaviourSummary =await logIntelligence(req.body.question);

        const prompt = `

        You are an advanced DSA learning intelligence system.
        
        Your job is to analyze a student's behavioral learning pattern for a coding question.
        
        Question Name:
        ${req.body.question}
        
        Behavior Summary:
        ${behaviourSummary.join("\n")}
        
        Analyze the student's learning behavior carefully.
        
        Based on the behavioral history, provide:
        
        1. Revision Priority
           - LOW
           - MEDIUM
           - HIGH
        
        2. Suggested Revision Gap
           - In how many days should the student revise this question again?
        
        3. Personalized Recommendation
           - Give a short actionable recommendation for improving retention.
        
        Return the response ONLY in this JSON format:
        
        {
          "priority": "",
          "revisionGapDays": "",
          "recommendation": ""
        }`;

        const aiResponse = await generateResponse(prompt);

        console.log("AI Response.....");

        console.log("AI Response:", aiResponse);
        
         //send response to client
        return res.status(200).json({ message: "Question log saved successfully" ,aiResponse: aiResponse});

    } catch (error) {
        console.error("Error saving question log:", error);
        res.status(500).json({ error: "Failed to save question log" });
    }
}



module.exports={logAttempt};