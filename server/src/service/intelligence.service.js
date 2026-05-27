const questionLogModel = require("../db/model");

async function logIntelligence(question) {

    try {

        // FETCH COMPLETE HISTORY OF QUESTION

        const historyOfQuestion =await questionLogModel.find({ question }).sort({ revisionNumber: 1 });

        if(historyOfQuestion.length === 0){
            return [];
        }
               
        // console.log("History Of Question:",historyOfQuestion);

        if(historyOfQuestion.length <2){
            return {
                message:"Not enough data to provide intelligence insights. Please log more attempts for this question."
            }
        }

        // ANALYZE TRENDS
        const questionName=historyOfQuestion[0].question;

        let trends=[];
        let behaviourSummary=[];

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


        for(let trend of trends){

                if(trend.timeData>15){
                    behaviourSummary.push("Significant improvement in time taken to solve the question.");

                }else if(trend.timeData>5 && trend.timeData<=15){
                    behaviourSummary.push("Moderate improvement in time taken to solve the question.");

                }else if(trend.timeData>=0 && trend.timeData<=5){
                    behaviourSummary.push("No significant improvement in time taken to solve the question.");

                }else if(trend.timeData<0){
                    behaviourSummary.push("Increase in time taken to solve the question.");
                }


                if(trend.failedAttemptsData>2){
                    behaviourSummary.push("Significant improvement in number of failed attempts."); 
                }else if(trend.failedAttemptsData>0 && trend.failedAttemptsData<=2){
                    behaviourSummary.push("Moderate improvement in number of failed attempts."); 
                }else if(trend.failedAttemptsData===0){
                    behaviourSummary.push("No significant improvement in number of failed attempts."); 
                }else if(trend.failedAttemptsData<0){
                    behaviourSummary.push("Increase in number of failed attempts."); 
                }
        }

        

        console.log("Trends:",trends);
        console.log("behaviourSummary:",behaviourSummary);

            
        return behaviourSummary ;
    }

    catch (error) {

        console.error("Intelligence Layer Error:",error);
        return [];
    }
}


module.exports = logIntelligence;


