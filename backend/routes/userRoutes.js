import express from 'express';
import {
  registerEmployee,
  getAllEmployees,
  getEmployeeById,
  deleteEmployee,
  loginUser,
  logout,
  updateEmployeeStatus
} from '../controller/userController.js';
import { validateToken, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin-only: Register a new employee
router.post('/register', validateToken, authorizeAdmin, registerEmployee);

// Admin-only: Get all employees
router.get('/employees', validateToken, authorizeAdmin, getAllEmployees);

// Admin-only: Get a single employee by ID
router.get('/employees/:id', validateToken, authorizeAdmin, getEmployeeById);

// Admin-only: Delete an employee by ID
router.delete('/employees/:id', validateToken, authorizeAdmin, deleteEmployee);

// Login for admin and employees
router.post('/login', loginUser);

// Logout for admin and employees
router.post('/logout', logout);

// Admin-only: Update an employee's status (Active/Inactive)
router.patch('/employees/:id', validateToken, authorizeAdmin, updateEmployeeStatus);

export default router;
