import User from "../models/User.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

// Get Data From User
// validate
// check if user already exists
// create user in databse
// create a user in databse
// create a verification token
// save token in database
// send token as email to user
// send sucess status to user

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await User.create({ name, email, password });
    console.log(user)

    if (!user) {
      return res.status(400).json({
        message: "User not created",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.verificationToken = token;
    console.log(`this is your token : ${token}`);
    await user.save();

    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      secure: false,
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.MAILTRAP_SENDEREMAIL,
      to: user.email,
      subject: "Verify your email ID",
      text: `Please verify your email by clicking: ${process.env.BASE_URL}/api/v1/users/verify/${token}`,
      html: `<p>Please click the following link to verify your email: <a href="${process.env.BASE_URL}/api/v1/users/verify/${token}">Verify Email</a></p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "User registered successfully. Please verify your email.",
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: "User not registered successfully",
      success: false,
      error,
    });
  }
};

export { registerUser };
