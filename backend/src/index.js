const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data
let tasks = [
  {
    id: 1,
    title: "Sample Task",
    description: "This is a sample task",
    dueDate: "2025-05-20",
    priority: "Medium",
    status: "To Do",
  },
];

// Mock API endpoints
app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/api/tasks", (req, res) => {
  const task = { ...req.body, id: Date.now() };
  tasks.push(task);
  res.json(task);
});

app.put("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  tasks = tasks.map((task) =>
    task.id === parseInt(id) ? { ...req.body, id: parseInt(id) } : task
  );
  res.json(tasks.find((task) => task.id === parseInt(id)));
});

app.delete("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  tasks = tasks.filter((task) => task.id !== parseInt(id));
  res.json({ message: "Task deleted" });
});

// Mock login endpoint
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    res.json({ email, message: "Login successful" });
  } else {
    res.status(400).json({ message: "Invalid credentials" });
  }
});

// Mock register endpoint
app.post("/api/register", (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    res.json({ email, message: "Registration successful" });
  } else {
    res.status(400).json({ message: "Invalid input" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
