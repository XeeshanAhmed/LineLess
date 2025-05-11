
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, text, otpCode) => {
  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');
      
      body {
        font-family: 'Poppins', sans-serif;
        margin: 0;
        padding: 0;
        background-color: #0f0f13;
      }
      
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background: #121218;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        border: 1px solid #252530;
      }
      
      .header {
        background: linear-gradient(135deg, #000000 0%, #2a2a3a 100%);
        padding: 40px 30px;
        text-align: center;
        color: white;
        position: relative;
        overflow: hidden;
        border-bottom: 2px solid #6e45e2;
      }
      
      .header h1 {
        margin: 0;
        font-size: 32px;
        font-weight: 700;
        position: relative;
        z-index: 1;
        text-shadow: 0 2px 10px rgba(110, 69, 226, 0.5);
      }
      
      .header p {
        margin: 10px 0 0;
        opacity: 0.8;
        font-weight: 300;
      }
      
      .content {
        padding: 30px;
        color: #e0e0e0;
      }
      
      .otp-box {
        background: linear-gradient(135deg, #1a1a24 0%, #252530 100%);
        border: 1px solid #333344;
        border-radius: 12px;
        padding: 25px;
        text-align: center;
        margin: 30px 0;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
      }
      
      .otp-code {
        font-size: 42px;
        font-weight: 700;
        letter-spacing: 8px;
        color: #ffffff;
        background: linear-gradient(90deg, #6e45e2, #89d4cf);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 2px 10px rgba(110, 69, 226, 0.3);
        margin: 15px 0;
        animation: pulse 2s infinite;
      }
      
      @keyframes pulse {
        0% { opacity: 0.9; }
        50% { opacity: 1; }
        100% { opacity: 0.9; }
      }
      
      .cta-button {
        display: inline-block;
        padding: 14px 28px;
        background: linear-gradient(135deg, #6e45e2 0%, #89d4cf 100%);
        color: white !important;
        text-decoration: none;
        border-radius: 8px;
        font-weight: 600;
        margin: 20px 0;
        transition: all 0.3s ease;
        box-shadow: 0 4px 20px rgba(110, 69, 226, 0.5);
      }
      
      .cta-button:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 25px rgba(110, 69, 226, 0.7);
      }
      
      .footer {
        background: #0a0a10;
        padding: 20px;
        text-align: center;
        font-size: 12px;
        color: #888;
        border-top: 1px solid #252530;
      }
      
      .highlight {
        color: #89d4cf;
        font-weight: 600;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <h1>LineLess</h1>
        <p>Your Gateway to Seamless Experiences</p>
      </div>
      
      <div class="content">
        <p>Hello there,</p>
        
        <p>Welcome to <span class="highlight">LineLess</span> – where innovation meets simplicity. We're here to make your digital journey smooth and secure.</p>
        
        <p>To continue, please verify your identity using the OTP below:</p>
        
        <div class="otp-box">
          <p style="margin: 0 0 10px; font-size: 14px; opacity: 0.8;">Your One-Time Password (OTP)</p>
          <div class="otp-code">${otpCode}</div>
          <p style="margin: 10px 0 0; font-size: 12px; opacity: 0.7;">Expires in 30 secons</p>
        </div>
        
        <p>For security reasons, do not share this code with anyone.</p>
        
        <center>
          <a href="#" class="cta-button">Verify Now</a>
        </center>
        
        <p>If you didn't request this, please ignore this email or contact support.</p>
        
        <p>Stay secure,<br>The <span class="highlight">LineLess</span> Team</p>
      </div>
      
      <div class="footer">
        © ${new Date().getFullYear()} LineLess. All rights reserved.<br>
        <a href="#" style="color: #6e45e2;">Help Center</a> | <a href="#" style="color: #fff;">Privacy Policy</a>
      </div>
    </div>
  </body>
  </html>
  `;

  const mailOptions = {
    from: `"LineLess" <${process.env.EMAIL_USER}>`,
    to,
    subject: subject || "Your LineLess OTP Code",
    text: text || `Your OTP is: ${otpCode}`,
    html: htmlContent
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
