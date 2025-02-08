import { Navigate } from 'react-router-dom'; // Importing Navigate component for redirection
import { useAuth } from '../contexts/AuthContext'; // Importing custom hook to access authentication context

// Component to restrict access to routes based on user authentication and roles
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth(); // Retrieve the current authenticated user from the context

  // Redirect to login page if no user is logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Check if the user's role is not included in the allowedRoles array
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user role
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard'} />;
  }

  // Render the child components if the user is authenticated and authorized
  return children;
}
