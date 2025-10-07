import { Trash2, CheckCircle2, Circle, Clock, AlertCircle } from "lucide-react";

const TaskItem = ({ task, onUpdate, onDelete }) => {
  const statusColors = {
    todo: { bg: "#fef3c7", border: "#f59e0b", text: "#92400e" },
    in_progress: { bg: "#dbeafe", border: "#3b82f6", text: "#1e40af" },
    done: { bg: "#d1fae5", border: "#10b981", text: "#065f46" },
  };

  const colors = statusColors[task.status];

  const toggleStatus = () => {
    const statusFlow = { todo: "in_progress", in_progress: "done", done: "todo" };
    const newStatus = statusFlow[task.status];
    onUpdate(task.id, { status: newStatus });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const isExpired = task.is_expired || (
    task.deadline && 
    new Date(task.deadline) < new Date() && 
    !task.is_finished
  );

  return (
    <div
      style={{
        background: "white",
        padding: 20,
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        borderLeft: `4px solid ${isExpired ? "#ef4444" : colors.border}`,
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateX(4px)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateX(0)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
            <h3
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 600,
                color: "#1f2937",
                textDecoration: task.is_finished ? "line-through" : "none",
                opacity: task.is_finished ? 0.6 : 1,
              }}
            >
              {task.title}
            </h3>
            <span
              style={{
                padding: "4px 12px",
                fontSize: 12,
                fontWeight: 600,
                background: colors.bg,
                color: colors.text,
                borderRadius: 20,
                textTransform: "capitalize",
              }}
            >
              {task.status.replace("_", " ")}
            </span>
            {isExpired && (
              <span
                style={{
                  padding: "4px 12px",
                  fontSize: 12,
                  fontWeight: 600,
                  background: "#fee2e2",
                  color: "#991b1b",
                  borderRadius: 20,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <AlertCircle size={12} /> Expired
              </span>
            )}
          </div>

          {task.description && (
            <p style={{ margin: "8px 0", fontSize: 14, color: "#6b7280", lineHeight: 1.5 }}>
              {task.description}
            </p>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10, fontSize: 12, color: "#9ca3af" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Clock size={14} /> Created: {formatDate(task.created_at)}
            </span>
            {task.deadline && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  color: isExpired ? "#ef4444" : "#9ca3af",
                }}
              >
                <AlertCircle size={14} /> Deadline: {formatDate(task.deadline)}
              </span>
            )}
            {task.finished_at && (
              <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#10b981" }}>
                <CheckCircle2 size={14} /> Completed: {formatDate(task.finished_at)}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginLeft: 15 }}>
          <button
            onClick={toggleStatus}
            style={{
              padding: 8,
              background: "#f3f4f6",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.background = "#e5e7eb")}
            onMouseOut={(e) => (e.target.style.background = "#f3f4f6")}
            title="Change status"
          >
            {task.is_finished ? (
              <Circle size={18} color="#6b7280" />
            ) : (
              <CheckCircle2 size={18} color="#667eea" />
            )}
          </button>
          <button
            onClick={() => onDelete(task.id)}
            style={{
              padding: 8,
              background: "#fef2f2",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.background = "#fee2e2")}
            onMouseOut={(e) => (e.target.style.background = "#fef2f2")}
            title="Delete task"
          >
            <Trash2 size={18} color="#ef4444" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;