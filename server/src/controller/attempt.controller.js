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

        //------------------QUESTIONS TRENDS ANALYSIS----------------------------//
        const behaviourSummary = await logIntelligence(req.body.question);

        if (behaviourSummary.message) {

            await intelligenceModel.findOneAndUpdate(

                { question: req.body.question },

                {
                    question: req.body.question,
                    priority: "LOW",
                    revisionGapDays: 3,
                    recommendation: "First attempt recorded. Revisit this question once more within 2-3 days to build retention.",
                    trendAnalysis: behaviourSummary.message
                },
                {
                    upsert: true
                }
            );
            return res.status(200).json({ message: "Question log saved successfully", intelligenceMessage: behaviourSummary.message });
        }


        //-------------------QUESTION INTELLIGENCE UPDATE CHECK-------------------------------//

        const AIanalysisCheckpoints = [2, 5, 10];

        const currentQuestionAttempts = await questionLogModel.countDocuments({ question: req.body.question });

        if (AIanalysisCheckpoints.includes(currentQuestionAttempts)) {

            const prompt = `
           You are a DSA learning intelligence system.
           
           Analyze student performance for a single question using past attempt data.
           
           Question: ${req.body.question}
           
           Behavior Summary:
           ${behaviourSummary}
           
           IMPORTANT:
           - Return ONLY valid JSON
           - No explanations, no markdown
           - Keep outputs concise
           
           Output format:
           {
             "questionIntelligence": {
               "question": "${req.body.question}",
               "priority": "",
               "revisionGapDays": "",
               "recommendation": "",
               "trendAnalysis": ""
             }
           }
           `;

            const aiResponse = await generateResponse(prompt);

            console.log("AI Response:", aiResponse);

            const parsedAI = JSON.parse(aiResponse);


            //SAVE INTELLIGENCE DATA TO DB

            await intelligenceModel.findOneAndUpdate(

                { question: req.body.question },

                {
                    question: req.body.question,
                    priority: parsedAI.questionIntelligence.priority,
                    revisionGapDays: parsedAI.questionIntelligence.revisionGapDays,
                    recommendation: parsedAI.questionIntelligence.recommendation,
                    trendAnalysis: parsedAI.questionIntelligence.trendAnalysis
                },
                {
                    upsert: true
                }

            );
        }

        //-------------------GLOBAL INTELLIGENCE UPDATE CHECK-------------------------------//

        const totalAttempts = await questionLogModel.countDocuments();

        const state = await globalIntelligenceModel.findOne({ key: "global_intelligence" });

        const lastProcessed = state?.lastProcessedCount || 0;

        // trigger only when +5 new attempts happened
        if (totalAttempts - lastProcessed >= 5) {

            await fetchAllIntelligenceData();

            await globalIntelligenceModel.findOneAndUpdate(
                { key: "global_intelligence" },
                { lastProcessedCount: totalAttempts },
                { upsert: true }
            );
        }

        //send response to client
        return res.status(200).json({ message: "Question log saved successfully" });

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

        // console.log("Question Logs:", questionLogs);
        // console.log("Intelligence Data:", intelligenceData);
        res.status(200).json({ questionLogs, intelligenceData });


    } catch (error) {
        console.error("Error fetching question logs:", error);
        res.status(500).json({ error: "Failed to fetch question logs" });
    }


}

async function getGlobalAnalysis(req, res) {

    try {
        const globalIntelligence = await globalIntelligenceModel.findOne({});

        if (!globalIntelligence) {
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


async function fetchAllIntelligenceData() {

    try {

        const allquestionLogs = await questionLogModel.find({});
        const allquestionIntelligence = await intelligenceModel.find({});

        const compactLogs = await questionLogModel.aggregate([
            {
                $group: {
                    _id: "$question",

                    totalAttempts: { $sum: 1 },
                    avgTimeSpent: { $avg: "$timeSpent" },
                    avgFailedAttempts: { $avg: "$failedAttempts" },

                    bestTime: { $min: "$timeSpent" },
                    worstTime: { $max: "$timeSpent" }
                }
            }
        ]);

        const prompt = `
        ALL QUESTION LOGS:
           ${JSON.stringify(compactLogs)}
           
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
           
           RETURN JSON ONLY IN THIS FORMAT
           
    {
           "overallIntelligence": {
               "weakAreas": [],
               "strongAreas": [],
               "revisionStrategy":"",
             }
     }
        `

        const aiResponse = await generateResponse(prompt);

        console.log("Global AI Analysis:", aiResponse);

        const parsedAI = JSON.parse(aiResponse);

        const globalIntelligence = await globalIntelligenceModel.findOneAndUpdate({}, {
            weakAreas: parsedAI.overallIntelligence.weakAreas,
            strongAreas: parsedAI.overallIntelligence.strongAreas,
            personalizedRecommendations: parsedAI.overallIntelligence.revisionStrategy
        }, { upsert: true, returnDocument: "after" }
        );


        return parsedAI.overallIntelligence;



    } catch (error) {
        console.error("Error fetching intelligence data:", error);
        return null;
    }

}

module.exports = { logAttempt, getQuestionLogs, getQuestionByName, getGlobalAnalysis, fetchAllIntelligenceData };