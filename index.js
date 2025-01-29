const express = require("express");
const app = express();
const cors = require("cors");
const authMiddleware = require("./middlewares/authMiddleware");
const todosRoutes = require("./routes/todos");
const authRoutes = require("./routes/auth");

app.use(cors());
app.use(express.json());

// Rutas públicas
app.use("/api", authRoutes);

// Rutas que requieren autenticación (JWT)
app.use("/api/todos", authMiddleware, todosRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
