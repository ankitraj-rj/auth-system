import User from "../models/User.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";



const registerUser = async (req, res) => {

  // Register User
  // Get Data From User
  // validate
  // check if user already exists
  // create user in databse
  // create a user in databse
  // create a verification token
  // save token in database
  // send token as email to user
  // send sucess status to user

  const { name, email, password } = req.body;

  // Input validation
  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in database
    const user = await User.create({ name, email, password: hashedPassword });

    if (!user) {
      return res.status(400).json({
        message: "User not created",
      });
    }

    // Create a verification token
    const token = crypto.randomBytes(32).toString("hex");
    user.verificationToken = token;
    console.log(`this is your token : ${token}`);
    await user.save();

    // Send token as email to user
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

    // Send success status to user
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

const verifyUser = async (req, res) => {

  // get token from url
  // validate - token aaya ya nahi aaya
  // find user based on token
  // if user not present
  // set isVerified filed to True
  // remove verificationToken form databse
  // save user
  // return response
  
  const { token } = req.params;

  // Validate token
  if (!token) {
    return res.status(400).json({
      message: "Verify token not found",
    });
  }

  try {
    // Find user based on token
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({
        message: "User not found on this token",
      });
    }

    // Set isVerified to true
    user.isVerified = true;
    user.verificationToken = undefined;

    // Save user
    await user.save();

    // Return response
    res.status(200).json({
      message: "User verified successfully",
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: "Verification failed",
      success: false,
      error,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate fields
  if (!email || !password) {
    return res.status(400).json({
      message: "Login error: All fields are required",
    });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Login error: Invalid email or password",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Login error: Invalid email or password",
      });
    }

    const token = jwt.sign({ id: user._id, role: role }, "shhhhh", {
      expiresIn: "24h",
    });

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    };

    res.cookie("token", token, cookieOptions);

    // Send success response
    res.status(200).json({
      message: "Login successful",
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({
      message: "Login failed",
      success: false,
      error,
    });
  }
};

const getMe = async (req,res) =>{
  try {
    
  } catch (error) {
    
  }
}

const logoutUser = async (req,res) =>{
  try {
    
  } catch (error) {
    
  }
}

const forgotPassword = async (req,res) =>{
  try {
    
  } catch (error) {
    
  }
}

const resetPassword = async (req,res) =>{
  try {
    
  } catch (error) {
    
  }
}

  

export { registerUser, verifyUser, login , getMe };
