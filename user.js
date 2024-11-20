require("dotenv").config();
const user = require("../models/user");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const secret = process.env.JWT_SECRET;
const sendEmail = require("../utils/sendEmail");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const errorHandler = require("../utils/errorHandler");
const order = require("../models/order");
const register = asyncErrorHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const emailAlreadyExists = await user.findOne({ email });
  if (emailAlreadyExists) {
    return next(new errorHandler("Email already exists", 400));
  }
  if (!name || !email || !password) {
    return next(new errorHandler("Please fill all fields", 400));
  }
  await user.create({
    name,
    email,
    password,
  });
@@ -182,27 +181,26 @@
    message: `
    <div style="background-color: #FFF0E3; padding: 20px;">
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
      <div style="padding: 20px;">
        <h1 style="color: #333; text-align: center;">Password Reset Request</h1>
        <p>Hello,</p>
        <p>We received a request to reset your password. Click the button below to set a new password:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${resetUrl}" style="background-color: #4CAF50; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; display: inline-block;">Reset Password</a>
        </div>
        <p>Please Note: This link is valid for 5 minutes.</p>
        <p>If you didn't request a password reset, please ignore this email or reply to let us know.</p>
        <p>Thanks</p>
        <p>Team Shoekart</p>
      </div>
    </div>
  </div>
    `,
  });
  res.status(200).json({
    success: true,
    message: `Email sent to ${email}`,
    token,
  });
});

const changeResetPassword = asyncErrorHandler(async (req, res, next) => {
  const { password, userId } = req.body;
  const token = req.headers.authorization.split(" ")[1];
  if (!password || !userId || !token)
    return next(new errorHandler("Please provide all fields", 400));
  const userExists = await user.findById(userId);
  if (!userExists) {
    return next(new errorHandler("User not found", 404));
  }
  const verify = jwt.verify(token, secret + userExists.password);
  // console.log(verify);
  if (verify.id !== userId && verify.exp < Date.now() / 1000) {
    return next(new errorHandler("Token has expired", 400));
  }
  userExists.password = password;
  await userExists.save();
  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });