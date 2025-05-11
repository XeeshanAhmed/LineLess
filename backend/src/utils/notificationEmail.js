import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
const sendNotificationEmail = (to, subject, businessName, departmentName) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="text-align: center; color: #4CAF50;">Your Turn is Near!</h2>
      <p>Dear user,</p>
      <p>Your token at <strong>${businessName}</strong> - <strong>${departmentName}</strong> is approaching soon.</p>
      <p>Please ensure you are ready and near the premises to avoid missing your turn.</p>
      <p style="text-align: center;">
        <a href="https://lineless.app" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Visit LineLess</a>
      </p>
      <hr style="margin: 20px 0; border: 0; border-top: 1px solid #ccc;">
      <p style="font-size: 0.9em; color: #777;">This is an automated email from LineLess. Please do not reply.</p>
    </div>
  `;

  transporter.sendMail({
    from: `"LineLess" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: htmlContent,
  }, (err, info) => {
    if (err) {
      console.error("Email error:", err);
    } else {
      console.log("Styled email sent:", info.response);
    }
  });
};
export default sendNotificationEmail;
