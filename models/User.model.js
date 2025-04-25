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
    isVerified: { type: Boolean, default: false },
    passwordResetToken: String,
    passwordResetExpiry: String,
    verificationToken: String,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("passowrd")) {
    this.password = await bcrypt.hash(this.password);
  }
  next();
});

const User = mongoose.model("user", userSchema);

export default User;
