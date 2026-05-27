const questionLogModel = require("../db/model");
const logIntelligence = require("../service/intelligence.service");
const generateResponse = require("../AIService");
const intelligenceModel = require("../db/intelligence.model");



async function logAttempt(req, res) {

    console.log("Received Data:", req.body);

    try {

        const questionExits = await questionLogModel.findOne({ question: req.body.question }).sort({ revisionNumber: -1 });

        if (questionExits) {

            await questionLogModel.create({
                question: req.body.question,
                timeSpent: req.body.timeSpent,
                failedAttempts: req.body.failedAttempts,
                revisionNumber: questionExits.revisionNumber + 1
            })


        } else {
            await questionLogModel.create({
                question: req.body.question,
                timeSpent: req.body.timeSpent,
                failedAttempts: req.body.failedAttempts
            });
        }

        const behaviourSummary = await logIntelligence(req.body.question);

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

        4. Trend Analysis
        Give the insights of the trend of the student's learning pattern for this question. Is it improving, declining, or inconsistent?
        For example-Solve time improved significantly after revision 4.
                   -Behavioral consistency still unstable.
                   -Recommended spaced repetition revision cycle detected.
        give short 2-3 line insights not more than that.

        Return the response ONLY in this JSON format:
        
        {
          "question":"${req.body.question}",
          "priority": "",
          "revisionGapDays": "",
          "recommendation": "",
          "trendAnalysis": "",

        }`;

        const aiResponse = await generateResponse(prompt);

        // console.log("AI Response.....");

        console.log("AI Response:", aiResponse);

        const parsedAI = JSON.parse(aiResponse);

        const trendPoints=parsedAI.trendAnalysis.split(".").filter(item => item.trim() !== "");

        await intelligenceModel.findOneAndUpdate(

            { question: req.body.question },

            {
                question: req.body.question,
                priority: parsedAI.priority,
                revisionGapDays: parsedAI.revisionGapDays,
                recommendation: parsedAI.recommendation,
                trendAnalysis: trendPoints
            },
            {
                upsert: true
            }

        );

        //send response to client
        return res.status(200).json({ message: "Question log saved successfully", aiResponse: aiResponse });

    } catch (error) {
        console.error("Error saving question log:", error);
        res.status(500).json({ error: "Failed to save question log" });
    }
}


async function getQuestionLogs(req, res) {

    try {
        const questions = await questionLogModel.aggregate([

            // LATEST QUESTION FIRST
            {
                $sort: {
                    _id: -1
                }
            },

            // GROUP SAME QUESTIONS
            {
                $group: {

                    _id: "$question",

                    latestQuestion: {
                        $first: "$$ROOT"
                    }

                }
            },

            // NORMAL OBJECT
            {
                $replaceRoot: {
                    newRoot: "$latestQuestion"
                }
            },

            // JOIN AI COLLECTION
            {
                $lookup: {

                    from: "questionintelligences",

                    localField: "question",

                    foreignField: "question",

                    as: "aiData"
                }
            },

            // CONVERT ARRAY -> OBJECT
            {
                $unwind: {
                    path: "$aiData",
                    preserveNullAndEmptyArrays: true
                }
            },

            // FINAL RESPONSE SHAPE
            {
                $project: {

                    question: 1,
                    timeSpent: 1,
                    failedAttempts: 1,
                    revisionNumber: 1,

                    priority: "$aiData.priority",

                    recommendation:
                        "$aiData.recommendation",

                    revisionGapDays:
                        "$aiData.revisionGapDays",

                    trendAnalysis:
                        "$aiData.trendAnalysis"
                }
            }

        ]);
        return res.status(200).json({ questions });

    } catch (error) {
        console.error("Error fetching question logs:", error);
        res.status(500).json({ error: "Failed to fetch question logs" });
    }
}

async function getQuestionByName(req,res) {

    try {

        const { questionName } = req.params;
        const questionLogs = await questionLogModel.find({ question: questionName }).sort({ revisionNumber: 1 });

        const intelligenceData = await intelligenceModel.findOne({ question: questionName });

        if(questionLogs.length === 0){
            return {
                questions:[]
            }
        }

        console.log("Question Logs:",questionLogs);
        console.log("Intelligence Data:",intelligenceData);
        res.status(200).json({ questionLogs, intelligenceData });

        
    }catch (error) {
        console.error("Error fetching question logs:", error);
        res.status(500).json({ error: "Failed to fetch question logs" });
    }


}

module.exports = { logAttempt, getQuestionLogs, getQuestionByName };