const questionLogModel = require("../db/model");
const logIntelligence = require("../service/intelligence.service");
const generateResponse = require("../AIService");
const intelligenceModel = require("../db/intelligence.model");
const globalIntelligenceModel = require("../db/globalintelligence.model");



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

        const allquestionLogs = await questionLogModel.find({});
        const allquestionIntelligence = await intelligenceModel.find({});

        const behaviourSummary = await logIntelligence(req.body.question);

        
           const prompt = `
           
           You are an advanced DSA learning intelligence system.
           
           You must analyze BOTH:
           1. Single question behavioral intelligence
           2. Overall DSA learning intelligence across all questions
           
           IMPORTANT:
           - Return ONLY valid JSON
           - No markdown
           - No explanations outside JSON
           - Keep recommendations concise and actionable
           
           ================================================
           TASK 1: SINGLE QUESTION INTELLIGENCE
           ================================================
           
           Question Name:
           ${req.body.question}
           
           Behavior Summary for this question based on past attempts:
           ${behaviourSummary}
           
           Analyze the student's behavioral learning pattern carefully.
           
           Provide:
           
           1. Revision Priority
              - LOW
              - MEDIUM
              - HIGH
           
           2. Suggested Revision Gap
              - Number of days after which revision should happen according to the forgetting curve and the student's performance
           
           3. Personalized Recommendation
              - Short actionable recommendation
           
           4. Trend Analysis
              - 2-3 short insights only
              - Mention whether learning is improving, inconsistent, or declining
              - Mention solve speed, mistakes, retention, consistency, etc.
           
           ================================================
           TASK 2: OVERALL LEARNING INTELLIGENCE
           ================================================
           
           ALL QUESTION LOGS:
           ${JSON.stringify(allquestionLogs)}
           
           PREVIOUS QUESTION INTELLIGENCE:
           ${JSON.stringify(allquestionIntelligence)}
           
           Analyze the student's OVERALL DSA preparation pattern.
           
           Identify:
           - Which topics/patterns are strong
           - Which topics/patterns are weak
           - Which areas need more revision
           
           Provide:
           
           1. Weak Areas
              - Array of weak topics/concepts
           
           2. Strong Areas
              - Array of strong topics/concepts
           
           3. Revision Strategy
              - short actionable strategy for overall improvement
           
           ================================================
           RETURN JSON ONLY IN THIS FORMAT
           ================================================
           
           {
             "questionIntelligence": {
                     "question":"${req.body.question}",
                     "priority": "",
                     "revisionGapDays": "",
                     "recommendation": "",
                     "trendAnalysis": "",
                   },
             "overallIntelligence": {
               "weakAreas": [],
               "strongAreas": [],
               "revisionStrategy":"",
           
             }
           }
           
           `;


        const aiResponse = await generateResponse(prompt);

        // console.log("AI Response.....");

        console.log("AI Response:", aiResponse);

        const parsedAI = JSON.parse(aiResponse);

        const trendPoints = parsedAI.questionIntelligence.trendAnalysis.split(".").filter(item => item.trim() !== "");

        await intelligenceModel.findOneAndUpdate(

            { question: req.body.question },

            {
                question: req.body.question,
                priority: parsedAI.questionIntelligence.priority,
                revisionGapDays: parsedAI.questionIntelligence.revisionGapDays,
                recommendation: parsedAI.questionIntelligence.recommendation,
                trendAnalysis: trendPoints
            },
            {
                upsert: true
            }

        );

        await globalIntelligenceModel.findOneAndUpdate({},{
            weakAreas: parsedAI.overallIntelligence.weakAreas,
            strongAreas: parsedAI.overallIntelligence.strongAreas,
            personalizedRecommendations: parsedAI.overallIntelligence.revisionStrategy
        }, { upsert: true, returnDocument: "after" }
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

async function getQuestionByName(req, res) {

    try {

        const { questionName } = req.params;
        const questionLogs = await questionLogModel.find({ question: questionName }).sort({ revisionNumber: 1 });

        const intelligenceData = await intelligenceModel.findOne({ question: questionName });

        if (questionLogs.length === 0) {
            return {
                questions: []
            }
        }

        console.log("Question Logs:", questionLogs);
        console.log("Intelligence Data:", intelligenceData);
        res.status(200).json({ questionLogs, intelligenceData });


    } catch (error) {
        console.error("Error fetching question logs:", error);
        res.status(500).json({ error: "Failed to fetch question logs" });
    }


}

async function getGlobalAnalysis(req,res){

    try {
        const globalIntelligence = await globalIntelligenceModel.findOne({});

        if(!globalIntelligence){
            return res.status(200).json({ message: "No intelligence data available yet." });
        }
        
        return res.status(200).json({
            weakAreas: globalIntelligence.weakAreas,
            strongAreas: globalIntelligence.strongAreas,
            personalizedRecommendations: globalIntelligence.personalizedRecommendations
        });

    }
    catch (error) {
        console.error("Error fetching global intelligence:", error);
        res.status(500).json({ error: "Failed to fetch global intelligence" });
    }
}

module.exports = { logAttempt, getQuestionLogs, getQuestionByName, getGlobalAnalysis };