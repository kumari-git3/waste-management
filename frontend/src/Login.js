import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("user");
  const [show, setShow] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (mode === "admin" && data.user.role !== "admin") {
        alert("❌ Not Admin account");
        return;
      }

      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } else {
      alert(data.message || "Login Failed ❌");
    }
  };

  return (
    <div style={container}>
      <div style={card}>
        <h2 style={title}>♻️ Eco Login</h2>

        {/* 🔘 TOGGLE */}
        <div style={toggleBox}>
          <button
            style={mode === "user" ? activeBtn : toggleBtn}
            onClick={() => setMode("user")}
          >
            👤 User
          </button>

          <button
            style={mode === "admin" ? activeBtn : toggleBtn}
            onClick={() => setMode("admin")}
          >
            🛠 Admin
          </button>
        </div>

        <form onSubmit={handleLogin}>
          <input
            style={input}
            type="email"
            placeholder={
              mode === "admin"
                ? "Enter Admin Email"
                : "Enter Email"
            }
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* 🔐 PASSWORD WITH SHOW/HIDE */}
          <div style={{ position: "relative" }}>
            <input
              style={input}
              type={show ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <span style={eye} onClick={() => setShow(!show)}>
              {show ? "🙈" : "👁️"}
            </span>
          </div>

          <button style={btn}>
            {mode === "admin"
              ? "Login as Admin"
              : "Login"}
          </button>
        </form>

        <p style={text}>
          Don’t have account?{" "}
          <Link to="/signup">Signup</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

/* 🎨 ECO PREMIUM UI */

const container = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background:
    "linear-gradient(135deg, #064e3b, #065f46, #022c22)",
};

const card = {
  background: "#ecfdf5",
  padding: "30px",
  borderRadius: "15px",
  width: "320px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
};

const title = {
  textAlign: "center",
  marginBottom: "20px",
  color: "#065f46",
};

const input = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  borderRadius: "8px",
  border: "1px solid #10b981",
};

const btn = {
  width: "100%",
  padding: "10px",
  background: "#10b981",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};

const text = {
  marginTop: "10px",
  textAlign: "center",
};

/* 🔘 TOGGLE */
const toggleBox = {
  display: "flex",
  marginBottom: "15px",
};

const toggleBtn = {
  flex: 1,
  padding: "8px",
  border: "none",
  background: "#d1fae5",
  cursor: "pointer",
};

const activeBtn = {
  ...toggleBtn,
  background: "#10b981",
  color: "#fff",
};

/* 👁️ EYE ICON */
const eye = {
  position: "absolute",
  right: "10px",
  top: "10px",
  cursor: "pointer",
};