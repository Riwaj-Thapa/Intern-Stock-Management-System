import User from '../models/User.js';
import jwt from 'jsonwebtoken';


// Register a new employee (Admin only)
export const registerEmployee = async (req, res) => {
  const { name, email, password, role = 'employee' } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Employee already exists' });
    }

    const user = new User({ name, email, password, role });
    await user.save();

    res.status(201).json({
      message: 'Employee registered successfully',
      employee: { id: user._id, name: user.name, email: user.email, role: user.role},
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering employee', error: error.message });
  }
};

// Get all employees (Admin only)
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" });
    res.status(200).json(employees); // Includes status by default
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch employees", error });
  }
};


// Get a single employee by ID (Admin only)
export const getEmployeeById = async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await User.findById(id).select('-password');
    if (!employee || employee.role !== 'employee') {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employee details', error: error.message });
  }
};

// Delete an employee by ID (Admin only)
export const deleteEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await User.findById(id);

    if (!employee || employee.role !== 'employee') {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting employee', error: error.message });
  }
};

// Login a user (Admin or Employee)
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if the user is inactive
    if (user.status === "Inactive") {
      return res.status(403).json({ message: "Your account is inactive. Please contact the administrator." });
    }

    // Check if the password matches
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Respond with the token and user data
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Logout a user (Admin or Employee)
export const logout = async (req, res) => {
  try {

    
    res.clearCookie('token'); // Assuming you store the token in a cookie

    // Log the action
    console.log("User logged out successfully");

    // Respond with a success message
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error logging out:", error); // Log the full error
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


export const updateEmployeeStatus = async (req, res) => {
  const { id } = req.params; // Employee ID
  const { status } = req.body; // New status (Active or Inactive)

  try {
    const employee = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return the updated document
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ message: "Status updated successfully", employee });
  } catch (error) {
    res.status(500).json({ message: "Failed to update status", error });
  }
};
