import React from "react";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div style={{ padding: "20px" }}>
      <h2>Welcome {user.name} 👋</h2>
      <p>This is Dashboard</p>
    </div>
  );
}

export default Dashboard;