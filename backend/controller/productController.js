import imagekit from "../config/imageKit.js";
import Product from "../models/Product.js";


// Middleware for checking roles
const isAdmin = (req) => req.user.role === "admin";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("supplier");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  if (!isAdmin(req)) {
    return res.status(403).json({ message: "Access denied. Only admins can create products." });
  }

  try {
    const { name, sku, quantity, price, category, supplier } = req.body;

    // Upload image to ImageKit if file exists
    let imageUrl = null;
    if (req.file) {
      const result = await imagekit.upload({
        file: req.file.buffer,             // Multer memory buffer
        fileName: `product_${Date.now()}`, // optional custom name
        folder: "/products",               // optional folder
      });
      imageUrl = result.url;
    }

    const product = new Product({
      name,
      sku,
      quantity,
      price,
      category,
      supplier,
      image: imageUrl,
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
export const updateProduct = async (req, res) => {

  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  if (!isAdmin(req)) {
    return res.status(403).json({ message: "Access denied. Only admins can delete products." });
  }
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};