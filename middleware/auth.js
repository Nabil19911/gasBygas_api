import jwt from "jsonwebtoken";

const authenticate = (roles) => (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.sendStatus(401); // Unauthorized
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("JWT verification error:", err.message);
      return res.sendStatus(403); // Forbidden
    }

    // Check if user roles include any of the required roles
    const hasRole = roles.includes(user.role.toUpperCase());
    if (!hasRole) {
      return res.sendStatus(403); // Forbidden
    }

    req.user = user;
    next();
  });
};

export default authenticate;
