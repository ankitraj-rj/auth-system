import User from "../models/User.model.js";
import crypto from "crypto";

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

    
  } catch (error) {}
};

const loginUser = async (req, res) => {
  res.send("loggedin Successfully");
};

export { registerUser, loginUser };
