const request = require("supertest");
const express = require("express");
const { router, tasks } = require("../routes/tasks"); // Import both separately

const app = express();
app.use(express.json());
app.use("/api/tasks", router); // Use the router only

describe("Task API", () => {
  beforeEach(() => {
    tasks.length = 0;
  });

  test("should create a new task", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .send({ title: "Test Task" });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.title).toBe("Test Task");
    expect(response.body.completed).toBe(false);
  });

  test("should get all tasks", async () => {
    await request(app).post("/api/tasks").send({ title: "Test Task" });
    const response = await request(app).get("/api/tasks");
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  test("should update a task", async () => {
    const createResponse = await request(app)
      .post("/api/tasks")
      .send({ title: "Test Task" });
    const taskId = createResponse.body.id;
    const response = await request(app)
      .put(`/api/tasks/${taskId}`)
      .send({ title: "Updated Task", completed: true });
    expect(response.status).toBe(200);
    expect(response.body.title).toBe("Updated Task");
    expect(response.body.completed).toBe(true);
  });

  test("should delete a task", async () => {
    const createResponse = await request(app)
      .post("/api/tasks")
      .send({ title: "Test Task" });
    const taskId = createResponse.body.id;
    const response = await request(app).delete(`/api/tasks/${taskId}`);
    expect(response.status).toBe(204);
    const getResponse = await request(app).get("/api/tasks");
    expect(getResponse.body).toHaveLength(0);
  });
});
