const express=require('express');
const cors=require('cors');
const route=require('./src/routes/routes');
require("dotenv").config();
const connectDB=require('./src/db/connection')

connectDB();

const app=express();

app.use(cors());
app.use(express.json());


app.use("/api",route);


app.listen(5000,()=>{
    console.log("Server is running on port 5000");
})

module.exports=app;