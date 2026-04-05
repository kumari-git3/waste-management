import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* Fix Leaflet icons */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function WasteManagementApp() {
  const [form, setForm] = useState({
    name: "",
    location: "",
    complaint: "",
    wasteType: "Plastic",
  });

  const [file, setFile] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [coords, setCoords] = useState({ lat: 17.385, lon: 78.4867 });

  /* 🔍 Smart Location (Google-like search feel) */
  const fetchCoordinates = async (place) => {
    if (!place) return;

    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${place}`
      );

      if (res.data.length > 0) {
        setCoords({
          lat: parseFloat(res.data[0].lat),
          lon: parseFloat(res.data[0].lon),
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  /* Fetch complaints */
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

  /* Input */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (e.target.name === "location") {
      fetchCoordinates(e.target.value);
    }
  };

  /* Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", form.name);
    data.append("location", form.location);
    data.append("complaint", form.complaint);
    data.append("wasteType", form.wasteType);
    data.append("lat", coords.lat);
    data.append("lon", coords.lon);
    if (file) data.append("image", file);

    await axios.post("http://localhost:5000/add", data);

    alert("✅ Complaint Added");

    setForm({
      name: "",
      location: "",
      complaint: "",
      wasteType: "Plastic",
    });

    setFile(null);
    fetchData();
  };

  return (
    <div style={styles.wrapper}>
      
      {/* LEFT FORM */}
      <div style={styles.card}>
        <h2 style={styles.title}>📝 Add Complaint</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Enter Name"
            value={form.name}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            name="location"
            placeholder="Search Location (Visakhapatnam...)"
            value={form.location}
            onChange={handleChange}
            style={styles.input}
          />

          <textarea
            name="complaint"
            placeholder="Enter Complaint"
            value={form.complaint}
            onChange={handleChange}
            style={styles.textarea}
          />

          <select
            name="wasteType"
            value={form.wasteType}
            onChange={handleChange}
            style={styles.input}
          >
            <option>Plastic</option>
            <option>Organic</option>
            <option>Metal</option>
          </select>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            style={styles.file}
          />

          <button style={styles.button}>Submit</button>
        </form>
      </div>

      {/* RIGHT MAP */}
      <div style={styles.card}>
        <h2 style={styles.title}>📍 Complaints Map</h2>

        <MapContainer
          center={[coords.lat, coords.lon]}
          zoom={6}
          scrollWheelZoom={true}
          style={styles.map}
        >
          {/* 🔥 BETTER MAP (Google-like style) */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
          />

          {complaints.map((c, i) => (
            <Marker key={i} position={[c.lat, c.lon]}>
              <Popup>
                <b>{c.name}</b><br />
                {c.location}<br />
                {c.complaint}<br />
                <b>{c.wasteType}</b><br />

                {c.image && (
                  <img
                    src={`http://localhost:5000/uploads/${c.image}`}
                    alt=""
                    style={{ width: "120px", borderRadius: "8px" }}
                  />
                )}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

/* 🎨 PREMIUM STYLES */
const styles = {
  wrapper: {
    display: "flex",
    gap: "20px",
    padding: "30px",
    minHeight: "100vh",
    background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
  },
  card: {
    flex: 1,
    background: "#1e293b",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 0 20px rgba(0,0,0,0.5)",
    color: "white",
  },
  title: {
    marginBottom: "15px",
    fontWeight: "600",
  },
  input: {
    width: "95%",
    padding: "8px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "none",
  },
  textarea: {
    width: "95%",
    height: "70px",
    padding: "8px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "none",
  },
  file: {
    marginBottom: "10px",
    color: "white",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "linear-gradient(to right, #00c6ff, #0072ff)",
    border: "none",
    borderRadius: "8px",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },
  map: {
    height: "320px",
    borderRadius: "12px",
  },
};

export default WasteManagementApp;