const express = require("express");
const router = express.Router();

// In-memory store (stateless)
let tasks = [];

// Get all tasks
router.get("/", (req, res) => {
  res.json(tasks);
});

// Create a task
router.post("/", (req, res) => {
  const task = {
    id: tasks.length + 1,
    title: req.body.title,
    completed: false,
  };
  tasks.push(task);
  res.status(201).json(task);
});

// Update a task
router.put("/:id", (req, res) => {
  const task = tasks.find((t) => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: "Task not found" });
  task.title = req.body.title || task.title;
  task.completed =
    req.body.completed !== undefined ? req.body.completed : task.completed;
  res.json(task);
});

// Delete a task
router.delete("/:id", (req, res) => {
  tasks = tasks.filter((t) => t.id !== parseInt(req.params.id));
  res.status(204).send();
});

module.exports = { router, tasks };
