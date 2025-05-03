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
        // const token=jwt.sign({id:user._id,role:user.role},JWT_SECRET,{ expiresIn: '1d' })
        res.status(201).json({
            message:'user created successfully',
            // token:token,
            role:user.role
        })
    } catch (error) {
        res.status(400).json({
            message:error.message
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

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET,{ expiresIn: '1d' });

        res.cookie("jwt", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000
        }).status(200).json({
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

const getLoggedInUser = (req, res) => {
    const token = req.cookies.jwt;
    console.log(token);
    if (!token) return res.status(401).json({ message: 'Not authenticated' });
  
    try {
        console.log("token tu mil gya h")
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log("decode b kr liya h",decoded);
      // Optionally fetch full user details from DB here using decoded.id
      res.status(200).json({ user: { id: decoded.id, role: decoded.role } });
    } catch (err) {
      res.status(401).json({ message: 'Invalid token' });
    }
  };
  
  

export {login,signUp,getLoggedInUser}