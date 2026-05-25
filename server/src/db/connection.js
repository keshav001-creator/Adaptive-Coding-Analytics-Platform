const mongoose=require("mongoose")


async function connectDB(){

    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connection to database successfull")
    
    }catch(err){
        console.log("or while connecting to DB",err)
    }
}


module.exports=connectDB