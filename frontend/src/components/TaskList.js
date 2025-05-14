import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const API_URL =
    process.env.REACT_APP_API_URL ||
    "http://backend-service.manager:5000/api/tasks";

  const fetchTasks = useCallback(async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      const response = await axios.post(API_URL, { title: newTask });
      setTasks([...tasks, response.data]);
      setNewTask("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updates);
      setTasks(tasks.map((task) => (task.id === id ? response.data : task)));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
          className="border p-2 mr-2 rounded"
        />
        <button
          onClick={addTask}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Task
        </button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex items-center justify-between mb-2 p-2 border rounded"
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() =>
                  updateTask(task.id, { completed: !task.completed })
                }
                className="mr-2"
              />
              <span
                className={task.completed ? "line-through text-gray-500" : ""}
              >
                {task.title}
              </span>
            </div>
            <button
              onClick={() => deleteTask(task.id)}
              className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
