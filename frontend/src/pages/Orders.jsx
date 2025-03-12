import { useState, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import Modal from "../components/Modal";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState({
    orderNumber: "",
    customer: "",
    items: [{ product: "", quantity: 1, price: 0 }],
    status: "Pending",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found in localStorage");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch orders.");

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch orders.");
    }
  };

  const fetchProducts = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found in localStorage");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch products.");

      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch products.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === "product") {
      const selectedProduct = products.find((p) => p._id === value);
      if (selectedProduct) {
        newItems[index].price = selectedProduct.price;
      }
    }

    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { product: "", quantity: 1, price: 0 }],
    }));
  };

  const removeItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const calculateTotal = () => {
    return formData.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const orderData = {
      orderNumber: formData.orderNumber,
      customer: formData.customer,
      items: formData.items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price,
      })),
      total: calculateTotal(),
      status: formData.status, // Include status in the request
    };
  
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
  
      const url = editingOrder
        ? `http://localhost:8000/api/orders/${editingOrder._id}`
        : "http://localhost:8000/api/orders";
      const method = editingOrder ? "PUT" : "POST";
  
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });
  
      if (!response.ok) throw new Error("Failed to save the order.");
  
      fetchOrders();
      fetchProducts(); // Fetch products again to reflect quantity changes
      handleCloseModal();
    } catch (err) {
      console.error(err);
      setError("Failed to save the order.");
    }
  };
  

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingOrder(null);
    setFormData({
      orderNumber: "",
      customer: "",
      items: [{ product: "", quantity: 1, price: 0 }],
      status: "Pending",
    });
    setError("");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          New Order
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
  <thead className="bg-gray-50">
    <tr>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Order Number
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Customer
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Total
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
    {orders.map((order) => (
      <tr key={order._id}>
        <td className="px-6 py-4 whitespace-nowrap">{order.orderNumber}</td>
        <td className="px-6 py-4 whitespace-nowrap">{order.customer}</td>
        <td className="px-6 py-4 whitespace-nowrap">${order.total.toFixed(2)}</td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              order.status === "Completed"
                ? "bg-green-100 text-green-800"
                : order.status === "Cancelled"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {order.status}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          <button
            onClick={() => {
              setEditingOrder(order);
              setFormData({
                ...order,
                items: order.items.map((item) => ({
                  product: item.product._id,
                  quantity: item.quantity,
                  price: item.price,
                })),
              });
              setIsModalOpen(true);
            }}
            className="text-indigo-600 hover:text-indigo-900 mr-3"
          >
            Edit
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
      </div>
             <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingOrder ? "Edit Order" : "New Order"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Order Number
            </label>
            <input
              type="text"
              name="orderNumber"
              value={formData.orderNumber}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Customer
            </label>
            <input
              type="text"
              name="customer"
              value={formData.customer}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Items
            </label>
            {formData.items.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <select
                  value={item.product}
                  onChange={(e) =>
                    handleItemChange(index, "product", e.target.value)
                  }
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Product</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name} - ${product.price}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(
                      index,
                      "quantity",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                {formData.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="px-2 py-1 text-red-600 hover:text-red-900"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addItem}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              + Add Item
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="mt-4">
            <p className="text-lg font-semibold">
              Total: ${calculateTotal().toFixed(2)}
            </p>
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
              {editingOrder ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Orders;
