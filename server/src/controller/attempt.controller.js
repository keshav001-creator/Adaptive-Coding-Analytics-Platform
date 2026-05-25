const questionLogModel=require("../db/model");
const logIntelligence=require("../service/intelligence.service");

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

        const history =
            await logIntelligence(
                req.body.question
         );


         //send response to client

        return res.status(200).json({ message: "Question log saved successfully" , history: history});

    } catch (error) {
        console.error("Error saving question log:", error);
        res.status(500).json({ error: "Failed to save question log" });
    }
}



module.exports={logAttempt};