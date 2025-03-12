import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";

import Orders from "./pages/Orders";

import Employees from "./pages/admin/Employees";
import InventoryAdmin from "./pages/admin/InventoryAdmin";
import SuppliersAdmin from "./pages/admin/SuppliersAdmin";
import SuppliersEmployee from "./pages/employee/SuppliersEmployee";
import InventoryEmployee from "./pages/employee/InventoryEmployee";
import LowStockPage1 from "./pages/admin/LowStock";
import Dashboard from "./pages/Dashboard";
import LowStockPage2 from "./pages/employee/LowStock";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <div className="flex h-screen bg-gray-50">
                  <Sidebar />
                  <div className="flex-1 overflow-auto">
                    <Routes>
                      <Route path="/inventory" element={<InventoryAdmin />} />
                      <Route path="/orders" element={<Orders />} />
                      <Route path="/suppliers" element={<SuppliersAdmin />} />
                      <Route path="/low-stock" element={<LowStockPage1 />} />
                      <Route path="/dashboard" element={<Dashboard />} />

                      <Route path="/employees" element={<Employees />} />
                    </Routes>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Employee Routes */}
          <Route
            path="/employee/*"
            element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <div className="flex h-screen bg-gray-50">
                  <Sidebar />
                  <div className="flex-1 overflow-auto">
                    <Routes>
                      <Route
                        path="/inventory"
                        element={<InventoryEmployee />}
                      />
                      <Route path="/orders" element={<Orders />} />
                      <Route
                        path="/suppliers"
                        element={<SuppliersEmployee />}
                      />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/low-stock" element={<LowStockPage2 />} />
                    </Routes>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
