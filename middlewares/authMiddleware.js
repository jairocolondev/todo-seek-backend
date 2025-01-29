// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Falta el header de autorización" });
  }

  // El header se envía como "Bearer <token>"
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token faltante o malformado" });
  }

  try {
    // Verificamos con la misma secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback");
    // Guardamos la info decodificada (por ejemplo, el email) en req.user
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
}

module.exports = authMiddleware;
