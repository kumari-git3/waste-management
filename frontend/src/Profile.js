
import React from "react";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={container}>
      <div style={card}>
        <h2>👤 Profile</h2>

        <p><b>Name:</b> {user?.name}</p>
        <p><b>Email:</b> {user?.email}</p>
        <p><b>Role:</b> {user?.role}</p>
      </div>
    </div>
  );
}

export default Profile;

const container = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#2c3e50",
};

const card = {
  background: "#fff",
  padding: "30px",
  borderRadius: "12px",
  width: "300px",
};