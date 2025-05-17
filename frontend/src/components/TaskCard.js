function TaskCard({ task, onEdit, onDelete, onToggleStatus }) {
  const priorityColors = {
    High: "border-red-500",
    Medium: "border-yellow-400",
    Low: "border-green-500",
  };

  const leftBarColors = {
    High: "bg-red-500",
    Medium: "bg-yellow-400",
    Low: "bg-green-500",
  };

  return (
    <div
      className={`relative bg-white p-4 rounded-xl shadow-md border-l-8 ${
        priorityColors[task.priority] || "border-gray-300"
      }`}
    >
      {/* Left bar */}
      <div
        className={`absolute left-0 top-0 h-full w-1 ${
          leftBarColors[task.priority] || "bg-gray-300"
        } rounded-l-xl`}
      />

      {/* Title */}
      <div className="mb-2 border-b pb-2">
        <h3 className="text-xl font-semibold text-gray-800">{task.title}</h3>
      </div>

      {/* Description */}
      <div className="mb-2">
        <p className="text-gray-600">{task.description}</p>
      </div>

      {/* Metadata */}
      <div className="mb-4 text-sm text-gray-500 space-y-1">
        <p>
          <span className="font-medium">Due:</span> {task.dueDate || "N/A"}
        </p>
        <p>
          <span className="font-medium">Priority:</span> {task.priority}
        </p>
        <p>
          <span className="font-medium">Status:</span> {task.status}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onToggleStatus(task.id)}
          className={`px-3 py-1 rounded-full text-white text-sm transition ${
            task.status === "Done"
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {task.status === "Done" ? "Mark Incomplete" : "Mark Complete"}
        </button>
        <button
          onClick={() => onEdit(task.id, task)}
          className="px-3 py-1 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-sm transition"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="px-3 py-1 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
