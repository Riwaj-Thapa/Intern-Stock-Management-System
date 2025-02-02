import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "employee"], required: true },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
});

const User = mongoose.model("User", userSchema);

export default User;
