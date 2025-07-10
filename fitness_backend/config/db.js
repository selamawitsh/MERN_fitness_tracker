import exprss from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv'


function connectDB(){
    try {
        mongoose.connect(process.env.MONGO_URI).then(()=>{
            console.log('Connected to MongoDB')
        })
        
    } catch (error) {
        console.log(error)
        
    }
    


}

export default connectDB