const request = require("supertest");
const express = require("express");
const cors = require("cors");
const app = express();

// Setup app with middleware and routes (same as index.js)
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

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    res.json({ email, message: "Login successful" });
  } else {
    res.status(400).json({ message: "Invalid credentials" });
  }
});

app.post("/api/register", (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    res.json({ email, message: "Registration successful" });
  } else {
    res.status(400).json({ message: "Invalid input" });
  }
});

describe("Task Manager API", () => {
  beforeEach(() => {
    // Reset tasks before each test
    tasks = [
      {
        id: 1,
        title: "Sample Task",
        description: "This is a sample task",
        dueDate: "2025-05-20",
        priority: "Medium",
        status: "To Do",
      },
    ];
  });

  // Test GET /api/tasks
  test("GET /api/tasks should return all tasks", async () => {
    const response = await request(app).get("/api/tasks");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(tasks);
    expect(response.body.length).toBe(1);
    expect(response.body[0].title).toBe("Sample Task");
  });

  // Test POST /api/tasks
  test("POST /api/tasks should create a new task", async () => {
    const newTask = {
      title: "New Task",
      description: "Test task",
      dueDate: "2025-05-21",
      priority: "High",
      status: "In Progress",
    };
    const response = await request(app).post("/api/tasks").send(newTask);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe("New Task");
    expect(response.body.id).toBeDefined();
    expect(tasks.length).toBe(2);
    expect(tasks[1].title).toBe("New Task");
  });

  // Test PUT /api/tasks/:id
  test("PUT /api/tasks/:id should update a task", async () => {
    const updatedTask = {
      title: "Updated Task",
      description: "Updated description",
      dueDate: "2025-05-22",
      priority: "Low",
      status: "Done",
    };
    const response = await request(app).put("/api/tasks/1").send(updatedTask);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe("Updated Task");
    expect(response.body.status).toBe("Done");
    expect(tasks[0].title).toBe("Updated Task");
  });

  // Test DELETE /api/tasks/:id
  test("DELETE /api/tasks/:id should delete a task", async () => {
    const response = await request(app).delete("/api/tasks/1");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Task deleted");
    expect(tasks.length).toBe(0);
  });

  // Test POST /api/login
  test("POST /api/login should return success with valid credentials", async () => {
    const credentials = { email: "test@example.com", password: "password" };
    const response = await request(app).post("/api/login").send(credentials);
    expect(response.status).toBe(200);
    expect(response.body.email).toBe("test@example.com");
    expect(response.body.message).toBe("Login successful");
  });

  test("POST /api/login should fail with invalid credentials", async () => {
    const credentials = { email: "", password: "" };
    const response = await request(app).post("/api/login").send(credentials);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid credentials");
  });

  // Test POST /api/register
  test("POST /api/register should return success with valid input", async () => {
    const credentials = { email: "test@example.com", password: "password" };
    const response = await request(app).post("/api/register").send(credentials);
    expect(response.status).toBe(200);
    expect(response.body.email).toBe("test@example.com");
    expect(response.body.message).toBe("Registration successful");
  });

  test("POST /api/register should fail with invalid input", async () => {
    const credentials = { email: "", password: "" };
    const response = await request(app).post("/api/register").send(credentials);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid input");
  });
});
