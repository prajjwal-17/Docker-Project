const Header = () => {
  return (
    <div style={{ textAlign: "center", marginBottom: 40 }}>
      <h1
        style={{
          fontSize: 48,
          fontWeight: 700,
          color: "white",
          margin: 0,
          textShadow: "0 2px 10px rgba(0,0,0,0.2)",
        }}
      >
        TaskFlow
      </h1>
      <p
        style={{
          color: "rgba(255,255,255,0.9)",
          fontSize: 16,
          marginTop: 8,
        }}
      >
        Organize your tasks with style
      </p>
    </div>
  );
};

export default Header;