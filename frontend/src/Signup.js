import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, role }),
    });

    if (res.ok) {
      alert("Signup Successful ✅");
      navigate("/login");
    } else {
      alert("Signup Failed ❌");
    }
  };

  return (
    <div style={container}>
      <div style={card}>
        <h2 style={title}>📝 Signup</h2>

        <form onSubmit={handleSignup}>
          <input
            style={input}
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            style={input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            style={input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <select
            style={input}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="driver">Driver</option>
          </select>

          <button style={btn}>Signup</button>
        </form>

        <p style={text}>
          Already have account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;

/* 🎨 UI */
const container = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(to right, #141e30, #243b55)",
};

const card = {
  background: "#fff",
  padding: "30px",
  borderRadius: "12px",
  width: "320px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
};

const title = {
  textAlign: "center",
  marginBottom: "20px",
};

const input = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const btn = {
  width: "100%",
  padding: "10px",
  background: "#16a34a",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
};

const text = {
  textAlign: "center",
  marginTop: "10px",
};

