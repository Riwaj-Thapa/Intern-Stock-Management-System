import { useState, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import Modal from "../../components/Modal";

// Employees management component
export default function Employees() {
  const [employees, setEmployees] = useState([]); // State to store the list of employees
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    status: "Active", // Default employee status
  });
  const [error, setError] = useState(""); // State to store error messages

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Fetch employees from the API
  const fetchEmployees = async () => {
    const token = localStorage.getItem("token"); // Retrieve the authorization token
    if (!token) {
      console.error("Authorization token not found.");
      setError("Authentication failed. Please log in again.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/users/employees", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch employees."); // Handle failed requests
      const data = await response.json(); // Parse JSON response
      setEmployees(data); // Update the state with employee data
    } catch (error) {
      setError(error.message); // Store error message in state
    }
  };

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value })); // Update form data
  };

  // Handle form submission to add a new employee
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Authorization token not found.");
      setError("Authentication failed. Please log in again.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to add employee.");
      fetchEmployees(); // Refresh the employee list
      handleCloseModal(); // Close the modal
    } catch (error) {
      setError(error.message);
    }
  };

  // Toggle the status (Active/Inactive) of an employee
  const toggleStatus = async (id, currentStatus) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication failed. Please log in again.");
      return;
    }

    try {
      const newStatus = currentStatus === "Active" ? "Inactive" : "Active"; // Toggle status
      const response = await fetch(
        `http://localhost:8000/api/users/employees/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) throw new Error("Failed to update status.");
      fetchEmployees(); // Refresh the employee list
    } catch (error) {
      setError(error.message);
    }
  };

  // Handle deletion of an employee
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication failed. Please log in again.");
      return;
    }

    // Confirmation before deletion
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/users/employees/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete employee.");
      }

      fetchEmployees(); // Refresh the employees list after deletion
    } catch (error) {
      console.error("Error deleting employee:", error);
      setError(
        error.message || "An unexpected error occurred while deleting the employee."
      );
    }
  };

  // Close the modal and reset form data
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      name: "",
      email: "",
      password: "",
      status: "Active",
    });
    setError("");
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Employees</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Employee
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Employee Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee) => (
              <tr key={employee.id || employee._id}>
                <td className="px-6 py-4 whitespace-nowrap">{employee.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{employee.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() =>
                      toggleStatus(employee.id || employee._id, employee.status)
                    }
                    className={`px-3 py-1 rounded-full text-sm ${
                      employee.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {employee.status}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => handleDelete(employee.id || employee._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Employee Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="text"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Add
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
