import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    role: {
      type: String,
      enum: ["user", "admin"], // Allowed values for the role user role
      default: "user", // bydefault value for user
    },
    isVerified: String,
    passwordResetToken: String,
    passwordResetExpiry: String,
    verificationToken: String,
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

export default User;
