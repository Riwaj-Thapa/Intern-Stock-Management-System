import express from "express";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Supplier from "../models/Supplier.js";

import { validateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/", validateToken, async (req, res) => {
  try {
    // Determine the user role (assuming it's stored in req.user.role)
    const userRole = req.user.role; // 'admin' or 'user'

    console.log(userRole);

    const totalProducts = await Product.countDocuments();
    const lowStockItems = await Product.countDocuments({ quantity: { $lte: 10 } });
    const pendingOrders = await Order.countDocuments({ status: "Pending" });
    const totalSuppliers = await Supplier.countDocuments();
    const completedOrders = await Order.countDocuments({ status: "Completed" });

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          status: "Completed",
          createdAt: {
            $gte: new Date(`${currentYear}-${currentMonth}-01`),
            $lte: new Date(`${currentYear}-${currentMonth + 1}-01`),
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" },
        },
      },
    ]);
    const totalRevenue = monthlyRevenue[0]?.totalRevenue || 0;

    const salesTrends = await Order.aggregate([
      {
        $match: { status: "Completed" },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          sales: { $sum: "$total" },
        },
      },
      {
        $sort: { "_id": 1 },
      },
    ]).then((data) =>
      data.map((item) => ({
        name: new Date(0, item._id - 1).toLocaleString("default", { month: "short" }),
        sales: item.sales,
      }))
    );

    res.json({
      stats: [
        {
          title: "Total Products",
          value: totalProducts,
          link: userRole === "admin" ? "/admin/inventory" : "/employee/inventory",
        },
        {
          title: "Low Stock Items",
          value: lowStockItems,
          link: userRole === "admin" ? "/admin/low-stock" : "/employee/low-stock",
        },
        {
          title: "Pending Orders",
          value: pendingOrders,
          link: userRole === "admin" ? "/admin/orders" : "/employee/orders",
        },
        {
          title: "Total Suppliers",
          value: totalSuppliers,
          link: userRole === "admin" ? "/admin/suppliers" : "/employee/suppliers",
        },
        {
          title: "Completed Orders",
          value: completedOrders,
          link: userRole === "admin" ? "/admin/orders" : "/employee/orders",
        },
        {
          title: "Monthly Revenue",
          value: `$${totalRevenue.toFixed(2)}`,
        },
      ],
      salesTrends,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
});

export default router;
