import express from "express";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";

dotenv.config();
connectDB();

const app = express();

const corsOptions = {
    origin: "http://localhost:5173", // Allow only this origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allowed HTTP methods
    credentials: true, // Allow credentials like cookies or authorization headers
  };
  
app.use(cors(corsOptions));

app.use("/uploads", express.static("uploads"));

// Middleware
app.use(express.json());

// Routes
app.use("/api/users", userRoutes); // User routes for admin and employee
app.use("/api/suppliers", supplierRoutes);
app.use("/api/products", productRoutes);

// Start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
