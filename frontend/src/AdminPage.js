import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* Fix Leaflet icon */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function AdminPage() {
  const [complaints, setComplaints] = useState([]);

  /* 🔄 FETCH DATA */
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/all");
      setComplaints(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* 🔁 UPDATE STATUS */
  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/update/${id}`, { status });
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  /* 📊 COUNTS */
  const total = complaints.length;
  const done = complaints.filter(c => c.status === "Done").length;
  const pending = complaints.filter(c => c.status === "Pending").length;

  return (
    <div style={styles.container}>

      {/* HEADER */}
      <h1 style={styles.title}>🔥 Admin Dashboard</h1>

      {/* STATS */}
      <div style={styles.stats}>
        <div style={styles.box}>Total: {total}</div>
        <div style={styles.boxGreen}>Done: {done}</div>
        <div style={styles.boxRed}>Pending: {pending}</div>
      </div>

      {/* MAP */}
      <div style={styles.card}>
        <h2>📍 Complaints Map</h2>

        <MapContainer
          center={[20, 78]}
          zoom={5}
          style={{ height: "300px", borderRadius: "10px" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />

          {complaints.map((c, i) => (
            <Marker key={i} position={[c.lat, c.lon]}>
              <Popup>
                <b>{c.name}</b><br />
                {c.location}<br />
                {c.complaint}<br />
                <b>{c.status}</b><br />

                {c.image && (
                  <img
                    src={`http://localhost:5000/uploads/${c.image}`}
                    alt=""
                    style={{ width: "100px", marginTop: "5px" }}
                  />
                )}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* TABLE */}
      <div style={styles.card}>
        <h2>📋 Complaints List</h2>

        <table style={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Complaint</th>
              <th>Type</th>
              <th>Status</th>
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {complaints.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>{c.location}</td>
                <td>{c.complaint}</td>
                <td>{c.wasteType}</td>

                <td>
                  <span
                    style={{
                      color: c.status === "Done" ? "lightgreen" : "orange",
                    }}
                  >
                    {c.status}
                  </span>
                </td>

                <td>
                  {c.image && (
                    <img
                      src={`http://localhost:5000/uploads/${c.image}`}
                      alt=""
                      style={{ width: "50px" }}
                    />
                  )}
                </td>

                <td>
                  <button
                    style={styles.btnGreen}
                    onClick={() => updateStatus(c._id, "Done")}
                  >
                    Done
                  </button>

                  <button
                    style={styles.btnRed}
                    onClick={() => updateStatus(c._id, "Pending")}
                  >
                    Pending
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* 🎨 STYLES */
const styles = {
  container: {
    padding: "20px",
    minHeight: "100vh",
    background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
    color: "white",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  stats: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: "20px",
  },
  box: {
    background: "#3b82f6",
    padding: "10px 20px",
    borderRadius: "8px",
  },
  boxGreen: {
    background: "green",
    padding: "10px 20px",
    borderRadius: "8px",
  },
  boxRed: {
    background: "red",
    padding: "10px 20px",
    borderRadius: "8px",
  },
  card: {
    background: "#1e293b",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "12px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  btnGreen: {
    background: "green",
    color: "white",
    margin: "2px",
    padding: "5px",
    border: "none",
    cursor: "pointer",
  },
  btnRed: {
    background: "orange",
    color: "white",
    margin: "2px",
    padding: "5px",
    border: "none",
    cursor: "pointer",
  },
};

export default AdminPage;