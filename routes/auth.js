const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const jcUser = {
  email: "simona@correo.com",
  password: "12345",
};

// POST /api/login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === jcUser.email && password === jcUser.password) {
    const token = jwt.sign(
      { email: jcUser.email },
      process.env.JWT_SECRET || "fallback",
      { expiresIn: "1h" }
    );

    return res.json({
      token,
      user: {
        email: jcUser.email,
      },
    });
  } else {
    return res.status(401).json({
      message: "Credenciales inválidas",
    });
  }
});

module.exports = router;
