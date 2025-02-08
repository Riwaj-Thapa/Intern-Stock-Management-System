import { NavLink } from 'react-router-dom'; // Import NavLink for navigation and active link styling
import { 
  HomeIcon, 
  CubeIcon, 
  ShoppingCartIcon, 
  TruckIcon, 
  UserGroupIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'; // Import icons from Heroicons
import { useAuth } from '../contexts/AuthContext'; // Import custom authentication hook

// Sidebar component for navigation
function Sidebar() {
  const { user, logout } = useAuth(); // Retrieve user info and logout function from AuthContext
  const isAdmin = user?.role === 'admin'; // Check if the user has an admin role
  const baseUrl = isAdmin ? '/admin' : '/employee'; // Set the base URL dynamically based on the user's role

  // Define menu items based on the user's role
  const menuItems = [
    { path: `${baseUrl}/dashboard`, name: 'Dashboard', icon: HomeIcon },
    { path: `${baseUrl}/inventory`, name: 'Inventory', icon: CubeIcon },
    { path: `${baseUrl}/orders`, name: 'Orders', icon: ShoppingCartIcon },
    { path: `${baseUrl}/suppliers`, name: 'Suppliers', icon: TruckIcon },
  ];

  // Add the Employees menu item if the user is an admin
  if (isAdmin) {
    menuItems.push({ path: '/admin/employees', name: 'Employees', icon: UserGroupIcon });
  }

  return (
    <div className="w-64 bg-white shadow-lg">
      {/* Header section */}
      <div className="p-4">
        <h1 className="text-2xl font-bold text-primary">ShopEase</h1> {/* Sidebar title */}
        <p className="text-sm text-gray-600 mt-1">Welcome, {user?.name}</p> {/* Welcome message */}
      </div>
      
      {/* Navigation section */}
      <nav className="mt-8">
        {menuItems.map((item) => (
          <NavLink
            key={item.path} // Key for list rendering
            to={item.path} // Navigation path
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
                isActive ? 'bg-blue-50 text-blue-600' : '' // Apply active styles if the route matches
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" /> {/* Icon for the menu item */}
            <span>{item.name}</span> {/* Name of the menu item */}
          </NavLink>
        ))}

        {/* Logout button */}
        <button
          onClick={logout} // Logout function triggered on click
          className="w-full flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" /> {/* Logout icon */}
          <span>Logout</span> {/* Logout label */}
        </button>
      </nav>
    </div>
  );
}

export default Sidebar; // Export the Sidebar component
