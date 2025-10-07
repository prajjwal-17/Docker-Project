const FilterButtons = ({ filter, onFilterChange }) => {
  const filters = ["all", "active", "completed"];

  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
      {filters.map((f) => (
        <button
          key={f}
          onClick={() => onFilterChange(f)}
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
  );
};

export default FilterButtons;