import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  category: { type: String },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
  image: { type: String },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
