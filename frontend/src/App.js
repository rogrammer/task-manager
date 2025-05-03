import React from "react";
import TaskList from "./components/TaskList";

function App() {
  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Task Manager</h1>
      <TaskList />
    </div>
  );
}

export default App;
