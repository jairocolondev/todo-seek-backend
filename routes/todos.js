const express = require("express");
const router = express.Router();

let jcTodos = [
  {
    id: 1,
    title: "Buy groceries",
    description: "Milk, Bread, Eggs",
    status: "pending",
  },
  {
    id: 2,
    title: "Walk the dog",
    description: "30 minute walk",
    status: "completed",
  },
];

// GET /api/todos -> Lista todas las tareas
router.get("/", (req, res) => {
  res.json(jcTodos);
});

// GET /api/todos/:id -> Muestra una tarea específica por ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const todo = jcTodos.find((t) => t.id === parseInt(id));
  if (!todo) {
    return res.status(404).json({ message: "Tarea no encontrada" });
  }
  res.json(todo);
});

// POST /api/todos -> Crea una nueva tarea
router.post("/", (req, res) => {
  const { title, description, status } = req.body;

  // Generar un nuevo ID tomando el más alto actual + 1
  const newId =
    jcTodos.length > 0 ? Math.max(...jcTodos.map((t) => t.id)) + 1 : 1;

  const newTodo = {
    id: newId,
    title,
    description,
    status: status || "pending",
  };

  jcTodos.push(newTodo);
  res.status(201).json(newTodo);
});

// PATCH /api/todos/:id -> Actualiza una tarea (parcial)
router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  const todoIndex = jcTodos.findIndex((t) => t.id === parseInt(id));

  if (todoIndex === -1) {
    return res.status(404).json({ message: "Tarea no encontrada" });
  }

  // Actualizamos solo los campos recibidos
  const updatedTodo = {
    ...jcTodos[todoIndex],
    ...(title !== undefined && { title }),
    ...(description !== undefined && { description }),
    ...(status !== undefined && { status }),
  };

  jcTodos[todoIndex] = updatedTodo;

  res.json(updatedTodo);
});

// DELETE /api/todos/:id -> Elimina una tarea
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const todoIndex = jcTodos.findIndex((t) => t.id === parseInt(id));

  if (todoIndex === -1) {
    return res.status(404).json({ message: "Tarea no encontrada" });
  }

  // Elimina la tarea del array
  jcTodos.splice(todoIndex, 1);

  res.json({ message: "Tarea eliminada exitosamente" });
});

module.exports = router;
