import { useState } from "react";
import { Plus } from "lucide-react";

const TaskForm = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = async () => {
    if (!title.trim()) return;

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        deadline: deadline || null,
      });
      setTitle("");
      setDescription("");
      setDeadline("");
    } catch (err) {
      console.error("Error submitting task:", err);
    }
  };

  return (
    <div
      style={{
        background: "white",
        padding: 25,
        borderRadius: 16,
        marginBottom: 25,
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
      }}
    >
      <h2
        style={{
          margin: "0 0 20px 0",
          fontSize: 20,
          fontWeight: 600,
          color: "#333",
        }}
      >
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
        onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
      />

      <textarea
        style={{
          width: "100%",
          padding: 14,
          fontSize: 15,
          border: "2px solid #e5e7eb",
          borderRadius: 10,
          marginBottom: 12,
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

      <input
        type="datetime-local"
        style={{
          width: "100%",
          padding: 14,
          fontSize: 15,
          border: "2px solid #e5e7eb",
          borderRadius: 10,
          marginBottom: 15,
          outline: "none",
          boxSizing: "border-box",
        }}
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        onFocus={(e) => (e.target.style.borderColor = "#667eea")}
        onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
      />

      <button
        onClick={handleSubmit}
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
  );
};

export default TaskForm;