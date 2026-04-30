import { configDotenv } from 'dotenv';
import mongoose from 'mongoose'

export const connectDb=async()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGO_URI);
        console.log(`DB connected ${conn}`)
    } catch (error) {
        console.error(error.message)
        process.exit(1)        
    }
}

