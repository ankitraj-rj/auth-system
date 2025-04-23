import User from "../models/User.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

const registerUser = async (req, res) => {
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

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  console.log(user);

  if (!user) {
    return res.status(400).json({
      message: "user not created",
    });
  }

  try {
    const exitingUser = await User.findOne({ email });

    if (exitingUser) {
      return res.status(400).json({
        message: "user already exist",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    console.log(token);
    user.verificationToken = token;
    await user.save();

    //Send Mail

    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.MAILTRAP_SENDEREMAIL, // sender address
      to: User.email, // list of receivers
      subject: "Verigy your mail id", // Subject line
      text: `please click on url link: ${process.env.BASE_URL}/api/v1/users/verify/${token}`, // plain text body
      html: "<b>Hello world?</b>", // html body
    };
  } catch (error) {
    
  }
};


const loginUser = async (req, res) => {
  res.send("loggedin Successfully");
};

export { registerUser, loginUser };
