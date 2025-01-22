import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
});

const Supplier = mongoose.model("Supplier", supplierSchema);

export default Supplier;
