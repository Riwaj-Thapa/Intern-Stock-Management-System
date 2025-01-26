import express from "express";
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../controller/supplierContoller.js";

import { validateToken, authorizeAdmin } from '../middleware/authMiddleware.js';


const router = express.Router();


router.post("/", validateToken,authorizeAdmin, createSupplier); 
router.put("/:id", validateToken, updateSupplier);
router.delete("/:id", validateToken,authorizeAdmin, deleteSupplier);
router.get("/",validateToken, getSuppliers);

export default router;