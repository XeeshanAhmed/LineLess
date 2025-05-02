import 'dotenv/config';
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const JWT_SECRET=process.env.JWT_SECRET;
console.log(JWT_SECRET);



const signUp=async (req,res)=>{
    try {
        const {email,username,password,role}=req.body;
        const hashedPass=await bcrypt.hash(password,10);
        const user=new User({
            email: email,
            username:username,
            password:hashedPass,
            role:role||'user'
        })
        await user.save();
        const token=jwt.sign({id:user._id,role:user.role},JWT_SECRET)
        
        res.status(201).json({
            message:'user created successfully',
            token:token,
            role:user.role
        })
    } catch (error) {
        res.status(400).json({
            message: "Email already exists",
            error: true
        })
    }
}

const login=async (req,res)=>{
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email : email});
        if (!user) throw new Error("User not found");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Wrong password");

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET);

        res.status(200).json({
             token, 
             role: user.role,
             message: "login successful"
         });
    } catch (error) {
        res.status(400).json({
            message:error.message
        })
    }
}

export {login,signUp}