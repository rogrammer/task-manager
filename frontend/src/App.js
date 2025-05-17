import { useState, useEffect } from "react";
import Login from "./components/Login";
import TaskForm from "./components/TaskForm";
import TaskCard from "./components/TaskCard";
import "./index.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);

  // Fetch tasks on mount (mocked)
  useEffect(() => {
    if (isLoggedIn) {
      fetch(`${process.env.REACT_APP_API_URL}/tasks`)
        .then((res) => res.json())
        .then((data) => setTasks(data))
        .catch((err) => console.error("Error fetching tasks:", err));
    }
  }, [isLoggedIn]);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setTasks([]);
  };

  const addTask = (task) => {
    fetch(`${process.env.REACT_APP_API_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    })
      .then((res) => res.json())
      .then((newTask) => setTasks([...tasks, newTask]))
      .catch((err) => console.error("Error adding task:", err));
  };

  const updateTask = (id, updatedTask) => {
    fetch(`${process.env.REACT_APP_API_URL}/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    })
      .then((res) => res.json())
      .then((updated) => {
        setTasks(tasks.map((task) => (task.id === id ? updated : task)));
      })
      .catch((err) => console.error("Error updating task:", err));
  };

  const deleteTask = (id) => {
    fetch(`${process.env.REACT_APP_API_URL}/tasks/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setTasks(tasks.filter((task) => task.id !== id));
      })
      .catch((err) => console.error("Error deleting task:", err));
  };

  const toggleTaskStatus = (id) => {
    const task = tasks.find((task) => task.id === id);
    const updatedTask = {
      ...task,
      status: task.status === "Done" ? "To Do" : "Done",
    };
    updateTask(id, updatedTask);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Task Manager</h1>
          <div className="flex items-center space-x-4">
            <span>Welcome, {user.email}</span>
            <button
              onClick={handleLogout}
              className="px-7 py-3 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm transition"
            >
              Logout
            </button>
          </div>
        </div>
        <TaskForm onSubmit={addTask} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={updateTask}
              onDelete={deleteTask}
              onToggleStatus={toggleTaskStatus}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
