const questionLogModel = require("../db/model");

async function logIntelligence(question) {

    try {

        // FETCH COMPLETE HISTORY OF QUESTION

        const historyOfQuestion =await questionLogModel.find({ question }).sort({ revisionNumber: 1 });

        if(historyOfQuestion.length === 0){
            return [];
        }
               
        console.log("History Of Question:",historyOfQuestion);

        if(historyOfQuestion.length <2){
            return {
                message:"Not enough data to provide intelligence insights. Please log more attempts for this question."
            }
        }

        let trends=[];

        for(let i=1 ; i<historyOfQuestion.length; i++){

            const questionName=historyOfQuestion[i].question;

            const previousquestion=historyOfQuestion[i-1].timeSpent;
            const PreviousFailedAttempts=historyOfQuestion[i-1].failedAttempts;

            const currentQuestion=historyOfQuestion[i].timeSpent;
            const currentFailedAttempts=historyOfQuestion[i].failedAttempts;

            const timeData=previousquestion - currentQuestion ;
            const failedAttemptsData=PreviousFailedAttempts - currentFailedAttempts ;

            trends.push({questionName,timeData,failedAttemptsData});

        }

        console.log("Trends:",trends);

            
         return trends ;

    }

    catch (error) {

        console.error("Intelligence Layer Error:",error);
        return [];
    }
}


module.exports = logIntelligence;


