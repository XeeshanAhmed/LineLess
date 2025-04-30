import express from "express"
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRouter from "./routes/authuser.route.js";


dotenv.config();
const app=express();
const PORT=process.env.PORT||8000;

app.use(express.json());
app.use('/api/userAuth',userRouter);



app.get('/',(req,res)=>{
    res.send("LineLess Backend Server")
});
connectDB()
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
});

