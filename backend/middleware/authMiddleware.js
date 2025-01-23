import jwt from 'jsonwebtoken';

// Middleware for token validation
const validateToken = (req, res, next) => {
    try {
        // Extract token from header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Extract the token after "Bearer"

        console.log("Received Token:", token);


        if (!token) {
            return res.status(401).json({ message: "Access token not provided" });
        }

        // Verify the token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error("Token verification error:", err.message);
                return res.status(403).json({ message: "Invalid or expired token" });
            }

            // Attach user information from the token payload
            req.user = decoded; 
            next();
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Generic middleware for role-based authorization
const authorizeRole = (roles) => {
    return (req, res, next) => {
        try {
            // Ensure the user is validated and has a valid role
            if (!req.user || !roles.includes(req.user.role)) {
                return res.status(403).json({ message: `Access denied. Required role(s): ${roles.join(', ')}` });
            }
            next();
        } catch (error) {
            return res.status(500).json({ message: "Internal server error", error: error.message });
        }
    };
};

// Specific middlewares for Admin and Employee (if still n
const authorizeAdmin = authorizeRole(['admin']);

export { validateToken, authorizeRole, authorizeAdmin };



