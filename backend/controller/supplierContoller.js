import Supplier from "../models/Supplier.js"

const isAdmin = (req) => req.user.role === "admin";

export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSupplier = async (req, res) => {
  if (!isAdmin(req)) {
    return res.status(403).json({ message: "Access denied. Only admins can add suppliers." });
  }
  try {
    // Check if a supplier with the same email already exists
    const existingSupplier = await Supplier.findOne({ email: req.body.email });
    if (existingSupplier) {
      return res.status(400).json({ message: "Supplier with this email already exists." });
    }

    const supplier = new Supplier(req.body);
    const savedSupplier = await supplier.save();
    res.status(201).json(savedSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateSupplier = async (req, res) => {
  if (!isAdmin(req)) {
    return res.status(403).json({ message: "Access denied. Only admins can update suppliers." });
  }
  try {
    const updatedSupplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteSupplier = async (req, res) => {
  if (!isAdmin(req)) {
    return res.status(403).json({ message: "Access denied. Only admins can delete suppliers." });
  }
  try {
    await Supplier.findByIdAndDelete(req.params.id);
    res.json({ message: "Supplier deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
