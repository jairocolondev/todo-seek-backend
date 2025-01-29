const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
const bcrypt = require("bcrypt");

const SECRET = process.env.JWT_SECRET || "fallback";

/**
 * Registro de un nuevo usuario
 * POST /api/register
 */
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Verificar si el email ya está registrado
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Ya existe un usuario con ese correo",
      });
    }

    // 2. Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Crear el usuario
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ userId: newUser.id }, SECRET, {
      expiresIn: "1h",
    });

    return res.status(201).json({
      message: "Usuario registrado con éxito",
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al registrar usuario",
      error: error.message,
    });
  }
});

/**
 * Inicio de sesión (login)
 * POST /api/login
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // 1. Buscar usuario
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  // 2. Validar Contraseña
  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  // 3. Generar token con userId
  const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: "1h" });

  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
    },
  });
});

module.exports = router;
