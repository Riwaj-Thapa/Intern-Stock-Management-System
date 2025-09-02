import express from "express";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controller/productController.js";

import { validateToken, authorizeAdmin } from '../middleware/authMiddleware.js';

import { upload } from "../middleware/multerConfig.js";

const router = express.Router();

router.get("/",validateToken, getProducts);
router.post("/", validateToken, authorizeAdmin, upload.single("image"), createProduct); 
router.put("/:id",validateToken, upload.single("image"), updateProduct); 
router.delete("/:id",validateToken,authorizeAdmin, deleteProduct);

export default router;