const express = require("express");
const router = express.Router();
const prisma = require("../prismaClient");

// GET /api/todos -> Tareas del usuario logueado
router.get("/", async (req, res) => {
  try {
    // userId viene del token
    const userId = req.user.userId;

    // Solo traigo los TODOS que pertenezcan al userId
    const todos = await prisma.todo.findMany({
      where: { userId },
    });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/todos -> Crea una tarea vinculada al usuario
router.post("/", async (req, res) => {
  const { title, description, status } = req.body;

  try {
    const userId = req.user.userId;

    const newTodo = await prisma.todo.create({
      data: {
        title,
        description,
        status: status || "pending",
        user: {
          connect: { id: userId },
        },
      },
    });
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/todos/:id -> Detalle de tarea, pero verifique que sea del user actual
router.get("/:id", async (req, res) => {
  const todoId = parseInt(req.params.id);
  const userId = req.user.userId;

  try {
    // Busco la tarea perteneciente a userId
    const todo = await prisma.todo.findFirst({
      where: {
        id: todoId,
        userId: userId,
      },
    });

    if (!todo) {
      return res
        .status(404)
        .json({ message: "Tarea no encontrada o no te pertenece" });
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/todos/:id -> Actualiza una tarea del user actual
router.patch("/:id", async (req, res) => {
  const todoId = parseInt(req.params.id);
  const userId = req.user.userId;
  const { title, description, status } = req.body;

  try {
    // Primero, busco la tarea del user actual
    let existingTodo = await prisma.todo.findFirst({
      where: { id: todoId, userId },
    });
    if (!existingTodo) {
      return res
        .status(404)
        .json({ message: "Tarea no encontrada o no te pertenece" });
    }

    // Actualizamos
    const updatedTodo = await prisma.todo.update({
      where: { id: todoId },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
      },
    });
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/todos/:id -> Elimina tarea del user actual
router.delete("/:id", async (req, res) => {
  const todoId = parseInt(req.params.id);
  const userId = req.user.userId;

  try {
    // Verifico que la tarea sea del user actual
    let existingTodo = await prisma.todo.findFirst({
      where: { id: todoId, userId },
    });
    if (!existingTodo) {
      return res
        .status(404)
        .json({ message: "Tarea no encontrada o no te pertenece" });
    }

    await prisma.todo.delete({
      where: { id: todoId },
    });
    res.json({ message: "Tarea eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
