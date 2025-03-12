import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LowStockPage = () => {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const navigate = useNavigate();

  // Fetching the data
  useEffect(() => {
    const fetchLowStockProducts = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found in localStorage");
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const data = await response.json();

        // Filter products with quantity < 10
        const lowStock = data.filter((product) => product.quantity < 10);
        setLowStockProducts(lowStock); // Store the low stock products in state
      } catch (error) {
        console.error("Error fetching low stock products:", error);
      }
    };

    fetchLowStockProducts();
  }, []);

  const handleNavigate = () => {
    navigate("/admin/inventory");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Low Stock Products</h1>
      <div>
        <button
          onClick={handleNavigate}
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Inventory Page
        </button>
      </div>

      {/* Displaying the low-stock products */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((item) => (
                <tr key={item._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-12 w-12 object-cover rounded"
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`${
                        item.quantity < 10
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      } px-4 py-2 rounded-full font-semibold`}
                    >
                      {item.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">${item.price}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center">
                  No low stock products available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LowStockPage;
