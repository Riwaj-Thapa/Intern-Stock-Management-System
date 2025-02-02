import express from "express";
import {
  getOrders,
  createOrUpdateOrder,
  deleteOrder,
} from "../controller/orderController.js";

const router = express.Router();

import { validateToken } from '../middleware/authMiddleware.js';

router.get("/", validateToken, getOrders);
router.post("/", validateToken, createOrUpdateOrder);
router.put("/:id", validateToken, createOrUpdateOrder);
router.delete("/:id", validateToken, deleteOrder);

export default router;
