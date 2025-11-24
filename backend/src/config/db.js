import 'dotenv/config';
import mongoose from 'mongoose'
import { DB_NAME } from '../constants/constants.js'

const connString=`${process.env.MONGO_URI}/${DB_NAME}`; //ADD DB NAME HERE WITH SLASH

const connectDB=async()=>{
    try {
        await mongoose.connect(connString);
        console.log('✅ MongoDB connected successfully')
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

export default connectDB;