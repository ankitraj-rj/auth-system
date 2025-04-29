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
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    if (!user) {
      return res.status(400).json({ message: "User not created" });
    }

    // Create a verification token
    const token = crypto.randomBytes(32).toString("hex");
    user.verificationToken = token;
    console.log(`This is your token: ${token}`);
    await user.save();

    // Send email
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
      token,
    });
    
  } catch (error) {
    res.status(400).json({ message: "Registration failed", error });
  }
};

const verifyUser = async (req, res) => {
  // Verify User
  // get token from url
  // validate - token aaya ya nahi aaya
  // find user based on token
  // if user not present
  // set isVerified filed to True
  // remove verificationToken form databse
  // save user
  // return response

  const { token } = req.params;

  if (!token) {
    return res.status(400).json({ message: "Verify token not found" });
  }

  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found with this token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res
      .status(200)
      .json({ message: "User verified successfully", success: true });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Verification failed", success: false, error });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res
        .status(400)
        .json({ message: "Please verify your email first" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    const cookieOptions = {
      httpOnly: true,
      secure: false, // Should be true in production
      maxAge: 24 * 60 * 60 * 1000,
    };

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      message: "Login successful",
      success: true,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({ message: "Login failed", error });
  }
};

const getMe = async (req, res) => {
  try {
    console.log("Reached Profile Route");
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(400).json({ message: "Error fetching user profile", error });
  }
};

const logoutUser = async (req,res) =>{
  try {
    res.cookie('token','',{}) // pass cookie options here

    res.status(200).json({
      success:true,
      message:"Logged out successfullyƒ"
    })
  } catch (error) {
    
  }
}

const forgotPassword = async ( req,res) =>{
  try {
    // get email
    //find user based on email 
    // reset token + rest expiry => Date.now() + 10*60*1000 => user.save
    //send email => design url 
  } catch (error) {
    
  }
}

const restPassword = async (req,res) =>{
  try {
    // collect token from params 
    // password from req.body
    
    const {token} = req.params
    const {password} = req.body

    try{
      const user = await User.findOne({
        passwordResetToken:token,
        passwordResetExpiry:{$gt: Date.now()}
      })

      // set password in user 
      // reset token , resetExpiry => rest 
      // save 
    } catch(error){

    }

  } catch (error) {
    
  }
}

export { registerUser, verifyUser, login, getMe,logoutUser };
