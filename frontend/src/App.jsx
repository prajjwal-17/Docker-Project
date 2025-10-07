import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import Header from "./components/Headers";
import StatsCards from "./components/StatsCard";
import TaskForm from "./components/TaskForm";
import FilterButtons from "./components/FilterButtons";
import TaskList from "./components/TaskList";
import AuthPage from "./components/AuthPAge";
import { useAuth } from "./context/AuthContext";
import { fetchTasks, createTask, updateTask, deleteTask } from "./services/api";

function App() {
  const { isAuthenticated, logout, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadTasks();
    }
  }, [isAuthenticated]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      // If unauthorized, token might be expired
      if (err.message.includes("Unauthorized")) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      await createTask(taskData);
      await loadTasks();
    } catch (err) {
      console.error("Error adding task:", err);
      throw err;
    }
  };

  const handleUpdateTask = async (id, updates) => {
    try {
      await updateTask(id, updates);
      await loadTasks();
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      await loadTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
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

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "white", fontSize: 18 }}>Loading...</p>
      </div>
    );
  }

  // Show auth page if not authenticated
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // Show main app if authenticated
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <Header />
          <button
            onClick={logout}
            style={{
              padding: "10px 20px",
              fontSize: 14,
              fontWeight: 600,
              background: "rgba(255,255,255,0.2)",
              color: "white",
              border: "2px solid rgba(255,255,255,0.3)",
              borderRadius: 8,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              e.target.style.background = "rgba(255,255,255,0.3)";
              e.target.style.borderColor = "rgba(255,255,255,0.5)";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "rgba(255,255,255,0.2)";
              e.target.style.borderColor = "rgba(255,255,255,0.3)";
            }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
        <StatsCards stats={stats} />
        <TaskForm onSubmit={handleAddTask} />
        <FilterButtons filter={filter} onFilterChange={setFilter} />
        <TaskList
          tasks={filteredTasks}
          filter={filter}
          loading={loading}
          onUpdate={handleUpdateTask}
          onDelete={handleDeleteTask}
        />
      </div>
    </div>
  );
}

export default App;