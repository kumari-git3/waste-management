import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* 🔴 RED MARKER */
const redIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [35, 35],
});

/* ================= NAVBAR ================= */
function Navbar() {
  return (
    <div style={nav}>
      <h3 style={{ color: "#fff" }}>Smart Waste System</h3>
      <div>
        <button style={navBtn}>Dashboard</button>
        <button style={navBtn}>Leaderboard</button>
        <button style={navBtn}>Logout</button>
      </div>
    </div>
  );
}

/* ================= MAIN APP ================= */
function WasteManagementApp() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [complaint, setComplaint] = useState("");
  const [recycling, setRecycling] = useState("Pending");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [lat, setLat] = useState(17.385);
  const [lon, setLon] = useState(78.4867);

  const role = localStorage.getItem("role");

  /* 📍 GET LOCATION */
  const getCoordinates = async () => {
    if (!location) return;
    const res = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${location}`
    );
    if (res.data.length > 0) {
      setLat(parseFloat(res.data[0].lat));
      setLon(parseFloat(res.data[0].lon));
    }
  };

  /* 📤 SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("location", location);
    formData.append("complaint", complaint);
    formData.append("recycling", recycling);
    formData.append("lat", lat);
    formData.append("lon", lon);
    if (image) formData.append("image", image);

    await axios.post("http://localhost:5000/add", formData);

    alert("Complaint Submitted ✅");

    setName("");
    setLocation("");
    setComplaint("");
    setPreview(null);

    fetchComplaints();
  };

  /* 📥 FETCH */
  const fetchComplaints = async () => {
    const res = await axios.get("http://localhost:5000/all");
    setComplaints(res.data);
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  /* 🏆 LEADERBOARD */
  const leaderboard = {};
  complaints.forEach((c) => {
    leaderboard[c.name] = (leaderboard[c.name] || 0) + 10;
  });

  const topUsers = Object.entries(leaderboard).sort((a, b) => b[1] - a[1]);

  /* ================= ADMIN PAGE ================= */
  if (role === "admin") {
    return (
      <div style={page}>
        <Navbar />

        <h2 style={title}>Admin Dashboard</h2>

        {/* MAP */}
        <div style={adminMapCard}>
          <MapContainer center={[17.385, 78.4867]} zoom={5} style={adminMap}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <MarkerClusterGroup>
              {complaints.map((c, i) => (
                <Marker key={i} position={[c.lat, c.lon]} icon={redIcon}>
                  <Popup>
                    <b>{c.name}</b> <br />
                    {c.complaint}
                  </Popup>
                </Marker>
              ))}
            </MarkerClusterGroup>
          </MapContainer>
        </div>

        {/* TABLE */}
        <div style={tableCard}>
          <h3>All Complaints</h3>

          <table style={table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>City</th>
                <th>Complaint</th>
                <th>Status</th>
                <th>Image</th>
              </tr>
            </thead>

            <tbody>
              {complaints.map((c, i) => (
                <tr key={i}>
                  <td>{c.name}</td>
                  <td>{c.location}</td>
                  <td>{c.complaint}</td>

                  <td>
                    <span
                      style={
                        c.recycling === "Done"
                          ? badgeDone
                          : badgePending
                      }
                    >
                      {c.recycling}
                    </span>
                  </td>

                  <td>
                    {c.image ? (
                      <img
                        src={`http://localhost:5000/uploads/${c.image}`}
                        style={tableImg}
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* LEADERBOARD */}
        <div style={leaderCard}>
          <h3>🏆 Leaderboard</h3>
          {topUsers.map((u, i) => (
            <div key={i} style={leaderItem}>
              {u[0]} — {u[1]} pts
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ================= USER PAGE ================= */
  return (
    <div style={page}>
      <Navbar />

      <h2 style={title}>Raise Complaint</h2>

      <div style={grid}>
        {/* FORM */}
        <div style={card}>
          <form onSubmit={handleSubmit}>
            <input
              style={input}
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              style={input}
              placeholder="Search Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onBlur={getCoordinates}
            />

            <textarea
              style={input}
              placeholder="Complaint"
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
            />

            <select
              style={input}
              value={recycling}
              onChange={(e) => setRecycling(e.target.value)}
            >
              <option>Pending</option>
              <option>Done</option>
            </select>

            <input
              type="file"
              onChange={(e) => {
                setImage(e.target.files[0]);
                setPreview(URL.createObjectURL(e.target.files[0]));
              }}
            />

            {preview && <img src={preview} style={previewImg} />}

            <button style={btn}>Submit</button>
          </form>
        </div>

        {/* MAP */}
        <div style={card}>
          <MapContainer center={[lat, lon]} zoom={10} style={map}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <MarkerClusterGroup>
              {complaints.map((c, i) => (
                <Marker key={i} position={[c.lat, c.lon]} icon={redIcon}>
                  <Popup>{c.name}</Popup>
                </Marker>
              ))}
            </MarkerClusterGroup>
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default WasteManagementApp;

/* ================= STYLES ================= */

const page = {
  minHeight: "100vh",
  padding: "20px",
  background: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
};

const title = {
  textAlign: "center",
  color: "#fff",
  marginBottom: "20px",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "1fr 1.2fr",
  gap: "20px",
};

const card = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
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
  background: "#2c5364",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
};

const map = {
  height: "300px",
  borderRadius: "10px",
};

const adminMap = {
  height: "220px",
  borderRadius: "10px",
};

const adminMapCard = {
  background: "#fff",
  padding: "10px",
  borderRadius: "12px",
};

const tableCard = {
  background: "#fff",
  padding: "20px",
  marginTop: "20px",
  borderRadius: "12px",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const tableImg = {
  width: "50px",
  height: "40px",
};

const badgeDone = {
  background: "green",
  color: "#fff",
  padding: "5px 10px",
  borderRadius: "10px",
};

const badgePending = {
  background: "orange",
  color: "#fff",
  padding: "5px 10px",
  borderRadius: "10px",
};

const leaderCard = {
  background: "#fff",
  padding: "20px",
  marginTop: "20px",
  borderRadius: "12px",
};

const leaderItem = {
  padding: "10px",
  borderBottom: "1px solid #ddd",
};

const previewImg = {
  width: "100%",
  height: "120px",
  objectFit: "cover",
  marginTop: "10px",
};

const nav = {
  display: "flex",
  justifyContent: "space-between",
  padding: "10px",
  background: "#203a43",
  marginBottom: "10px",
};

const navBtn = {
  margin: "5px",
  padding: "8px",
  background: "#fff",
  borderRadius: "6px",
};