const mongoose=require("mongoose")


const questionLogSchema=new mongoose.Schema({

    question:{
        type:String,
        required:true
    },
    timeSpent:{
        type:Number,
        required:true
    },
    failedAttempts:{
        type:Number,
        required:true
    },
    revisionNumber:{
        type:Number,
        required:true ,
        default:1 
    }
},{timestamps:true})

const questionLogModel=mongoose.model("QuestionLogs",questionLogSchema)

module.exports=questionLogModel