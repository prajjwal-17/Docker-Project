import { useState, useEffect } from "react";
import { Trash2, Plus, CheckCircle2, Circle, Clock } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API}/tasks`);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const addTask = async () => {
    if (!title.trim()) return;

    try {
      const res = await fetch(`${API}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      if (res.ok) {
        setTitle("");
        setDescription("");
        await fetchTasks();
      }
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API}/tasks/${id}`, { method: "DELETE" });
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const toggleStatus = async (task) => {
    const statusFlow = { todo: "in_progress", in_progress: "done", done: "todo" };
    const newStatus = statusFlow[task.status];

    try {
      await fetch(`${API}/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchTasks();
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return !t.is_finished;
    if (filter === "completed") return t.is_finished;
    return true;
  });

  const stats = {
    total: tasks.length,
    active: tasks.filter((t) => !t.is_finished).length,
    completed: tasks.filter((t) => t.is_finished).length,
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "20px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ fontSize: 48, fontWeight: 700, color: "white", margin: 0, textShadow: "0 2px 10px rgba(0,0,0,0.2)" }}>
            TaskFlow
          </h1>
          <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 16, marginTop: 8 }}>
            Organize your tasks with style
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 15, marginBottom: 30 }}>
          <div style={{ background: "rgba(255,255,255,0.95)", padding: "20px", borderRadius: 12, textAlign: "center", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#667eea" }}>{stats.total}</div>
            <div style={{ fontSize: 14, color: "#666", marginTop: 4 }}>Total Tasks</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.95)", padding: "20px", borderRadius: 12, textAlign: "center", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#f59e0b" }}>{stats.active}</div>
            <div style={{ fontSize: 14, color: "#666", marginTop: 4 }}>Active</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.95)", padding: "20px", borderRadius: 12, textAlign: "center", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#10b981" }}>{stats.completed}</div>
            <div style={{ fontSize: 14, color: "#666", marginTop: 4 }}>Completed</div>
          </div>
        </div>

        {/* Add Task Card */}
        <div style={{ background: "white", padding: 25, borderRadius: 16, marginBottom: 25, boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}>
          <h2 style={{ margin: "0 0 20px 0", fontSize: 20, fontWeight: 600, color: "#333" }}>
            Create New Task
          </h2>
          <input
            style={{
              width: "100%",
              padding: 14,
              fontSize: 16,
              border: "2px solid #e5e7eb",
              borderRadius: 10,
              marginBottom: 12,
              outline: "none",
              transition: "border 0.2s",
              boxSizing: "border-box",
            }}
            placeholder="Task title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={(e) => (e.target.style.borderColor = "#667eea")}
            onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
            onKeyPress={(e) => e.key === "Enter" && addTask()}
          />
          <textarea
            style={{
              width: "100%",
              padding: 14,
              fontSize: 15,
              border: "2px solid #e5e7eb",
              borderRadius: 10,
              marginBottom: 15,
              outline: "none",
              resize: "vertical",
              minHeight: 80,
              fontFamily: "inherit",
              boxSizing: "border-box",
            }}
            placeholder="Description (optional)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onFocus={(e) => (e.target.style.borderColor = "#667eea")}
            onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
          />
          <button
            onClick={addTask}
            style={{
              width: "100%",
              padding: "14px 24px",
              fontSize: 16,
              fontWeight: 600,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: 10,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.4)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            <Plus size={20} /> Add Task
          </button>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          {["all", "active", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                flex: 1,
                padding: "12px",
                fontSize: 14,
                fontWeight: 600,
                background: filter === f ? "white" : "rgba(255,255,255,0.3)",
                color: filter === f ? "#667eea" : "white",
                border: "none",
                borderRadius: 10,
                cursor: "pointer",
                transition: "all 0.2s",
                textTransform: "capitalize",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Tasks List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filteredTasks.map((t) => {
            const statusColors = {
              todo: { bg: "#fef3c7", border: "#f59e0b", text: "#92400e" },
              in_progress: { bg: "#dbeafe", border: "#3b82f6", text: "#1e40af" },
              done: { bg: "#d1fae5", border: "#10b981", text: "#065f46" },
            };
            const colors = statusColors[t.status];

            return (
              <div
                key={t.id}
                style={{
                  background: "white",
                  padding: 20,
                  borderRadius: 12,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  borderLeft: `4px solid ${colors.border}`,
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
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: 18,
                          fontWeight: 600,
                          color: "#1f2937",
                          textDecoration: t.is_finished ? "line-through" : "none",
                          opacity: t.is_finished ? 0.6 : 1,
                        }}
                      >
                        {t.title}
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
                        {t.status.replace("_", " ")}
                      </span>
                    </div>
                    {t.description && (
                      <p style={{ margin: "8px 0", fontSize: 14, color: "#6b7280", lineHeight: 1.5 }}>
                        {t.description}
                      </p>
                    )}
                    <div style={{ display: "flex", gap: 15, marginTop: 10, fontSize: 12, color: "#9ca3af" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Clock size={14} /> {new Date(t.created_at).toLocaleString()}
                      </span>
                      {t.finished_at && (
                        <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#10b981" }}>
                          <CheckCircle2 size={14} /> {new Date(t.finished_at).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginLeft: 15 }}>
                    <button
                      onClick={() => toggleStatus(t)}
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
                      {t.is_finished ? <Circle size={18} color="#6b7280" /> : <CheckCircle2 size={18} color="#667eea" />}
                    </button>
                    <button
                      onClick={() => deleteTask(t.id)}
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
          })}
          {filteredTasks.length === 0 && (
            <div style={{ textAlign: "center", padding: 60, color: "rgba(255,255,255,0.8)" }}>
              <p style={{ fontSize: 18, margin: 0 }}>No tasks found</p>
              <p style={{ fontSize: 14, marginTop: 8, opacity: 0.8 }}>
                {filter === "all" ? "Create your first task above!" : `No ${filter} tasks yet`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;