const StatsCards = ({ stats }) => {
  const cards = [
    { label: "Total Tasks", value: stats.total, color: "#667eea" },
    { label: "Active", value: stats.active, color: "#f59e0b" },
    { label: "Completed", value: stats.completed, color: "#10b981" },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 15,
        marginBottom: 30,
      }}
    >
      {cards.map((card) => (
        <div
          key={card.label}
          style={{
            background: "rgba(255,255,255,0.95)",
            padding: "20px",
            borderRadius: 12,
            textAlign: "center",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: card.color,
            }}
          >
            {card.value}
          </div>
          <div
            style={{
              fontSize: 14,
              color: "#666",
              marginTop: 4,
            }}
          >
            {card.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;