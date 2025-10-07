import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
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

      {isLogin ? (
        <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
      ) : (
        <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
      )}
    </div>
  );
};

export default AuthPage;