import express from "express";


import sendEmail from "../utils/sendEmail.js";

import { login, signUp,getLoggedInUser,logout } from "../controllers/authUser.controller.js";


const router = express.Router();


// Route: POST /api/userAuth/send-otp
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ message: "Valid email is required" });
  }

  const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP

  try {
    await sendEmail(
      email,
      "Your LineLess OTP Code",
      `JazakAllah Kahir for Registering to LineLess \nYour OTP code is: ${otp}. It will expire in 5 minutes.`
    );

    // ⚠️ For production, do not expose the OTP
    res.status(200).json({ message: "OTP sent successfully", otp });
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    res.status(500).json({ message: "Failed to send OTP", error: error.message });
  }
});

router.post('/signup',signUp);
router.post('/login',login);
router.get('/me', getLoggedInUser);
router.post('/logout', logout);

export default router;
