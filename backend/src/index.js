import express from "express"
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import connectDB from "./config/db.js";
import userRouter from "./routes/authuser.route.js";
import businessRoutes from "./routes/authBusiness.route.js";
import businessListRoutes from "./routes/businessList.route.js";
import departmentRoutes from './routes/department.route.js';
import tokenRoutes from './routes/token.route.js'

import cors from "cors";


dotenv.config();
const app=express();
const PORT=process.env.PORT||8000;

app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true
  }));
app.use(cookieParser());


app.use(express.json());
app.use('/api/userAuth',userRouter);
app.use('/api/businessAuth', businessRoutes);
app.use("/api/business", businessListRoutes);
app.use("/api/department",departmentRoutes)
app.use("/api/token",tokenRoutes)


app.get('/',(req,res)=>{
    res.send("LineLess Backend Server")
});
connectDB()
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
});

