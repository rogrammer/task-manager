const express = require("express");
const router = express.Router();

// In-memory store (stateless)
const tasks = []; // Use const and mutate with push/splice etc.

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
  const index = tasks.findIndex((t) => t.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Task not found" });
  tasks.splice(index, 1);
  res.status(204).send();
});

module.exports = {
  tasks, // for testing
  router, // for app
};
