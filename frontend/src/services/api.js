const API_BASE_URL = 'http://localhost:8000/api'; // Update with your backend API base URL

// Helper function for API requests
const apiRequest = async (endpoint, method, body = null, isAuthRequired = false) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (isAuthRequired) {
      const token = localStorage.getItem('token');
      console.log("Authorization Token for API:", token); // Debugging
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      } else {
        throw new Error('No authentication token found');
      }
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("API Error Response:", data); // Debugging
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error(`API Request Error: ${error.message}`);
    throw error;
  }
};


// Login function
export const login = async (email, password) => {
  return await apiRequest('/users/login', 'POST', { email, password });
};

// Logout function
export const logout = async () => {
  return await apiRequest('/users/logout', 'POST', null, true); // Requires authentication
};



