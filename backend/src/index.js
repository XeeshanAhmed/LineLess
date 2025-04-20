import express from "express"
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();
const app=express();
const PORT=process.env.PORT||8000;

app.use(express.json());

app.get('/',(req,res)=>{
    res.send("LineLess Backend Server")
});
connectDB()
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
});

