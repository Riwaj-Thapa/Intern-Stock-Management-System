import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [salesData, setSalesData] = useState([]);
  const [stats, setStats] = useState([
    { title: "Total Products", value: 0 },
    { title: "Low Stock Items", value: 0 },
    { title: "Pending Orders", value: 0 },
    { title: "Total Suppliers", value: 0 },
    { title: "Completed Orders", value: 0 },
    { title: "Monthly Revenue", value: "$0" },
  ]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found in localStorage");
      setError("You are not logged in. Please login first.");
      navigate("/login"); // Redirect to login page if no token
      return;
    }
    fetchDashboardData(token); // Proceed with data fetch if token exists
  }, [navigate]);

  const fetchDashboardData = async (token) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASEURL}/api/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.status}`);
      }
      const data = await response.json();
      setSalesData(data.salesTrends);
      setStats(data.stats);
      setError(null);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data. Please try again later.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`bg-white p-6 rounded-lg shadow-lg border border-gray-200 cursor-pointer 
            ${stat.link ? "hover:bg-gray-100 transition" : ""}`} // Add hover effect only if link exists
            onClick={() => {
              // Check if link exists before navigating
              if (stat.link) {
                console.log("Navigating to:", stat.link); // Debugging output
                navigate(stat.link); // Navigate if link exists
              } else {
                console.log(`No link for: ${stat.title}`); // Debugging output for non-clickable items
              }
            }}
          >
            <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-semibold mt-2 text-gray-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Sales Overview</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#2563eb"
                fill="#93c5fd"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
