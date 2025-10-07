import TaskItem from "./TaskItem";

const TaskList = ({ tasks, filter, loading, onUpdate, onDelete }) => {
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 60, color: "rgba(255,255,255,0.8)" }}>
        <p style={{ fontSize: 18, margin: 0 }}>Loading tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: 60, color: "rgba(255,255,255,0.8)" }}>
        <p style={{ fontSize: 18, margin: 0 }}>No tasks found</p>
        <p style={{ fontSize: 14, marginTop: 8, opacity: 0.8 }}>
          {filter === "all" ? "Create your first task above!" : `No ${filter} tasks yet`}
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TaskList;