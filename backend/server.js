const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();

/* ✅ MIDDLEWARE */
app.use(cors());
app.use(express.json());

/* 📁 STATIC FOLDER (for images) */
app.use("/uploads", express.static("uploads"));

/* 🗂 MULTER (IMAGE UPLOAD) */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage });

/* 🧠 MONGODB CONNECTION */
mongoose.connect("mongodb://127.0.0.1:27017/wasteDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.log(err));

/* 📦 SCHEMA */
const complaintSchema = new mongoose.Schema({
  name: String,
  location: String,
  complaint: String,
  wasteType: String,
  image: String,
  lat: Number,
  lon: Number,
  status: { type: String, default: "Pending" }
});

const Complaint = mongoose.model("Complaint", complaintSchema);

/* 🚀 ROUTES */

/* ➕ ADD COMPLAINT */
app.post("/add", upload.single("image"), async (req, res) => {
  try {
    const newComplaint = new Complaint({
      name: req.body.name,
      location: req.body.location,
      complaint: req.body.complaint,
      wasteType: req.body.wasteType,
      image: req.file ? req.file.filename : "",
      lat: parseFloat(req.body.lat),
      lon: parseFloat(req.body.lon),
      status: "Pending"
    });

    await newComplaint.save();
    res.json({ message: "Complaint Added" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* 📥 GET ALL COMPLAINTS */
app.get("/all", async (req, res) => {
  try {
    const data = await Complaint.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* 🔄 UPDATE STATUS */
app.put("/update/:id", async (req, res) => {
  try {
    await Complaint.findByIdAndUpdate(req.params.id, {
      status: req.body.status
    });

    res.json({ message: "Status Updated" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* 🚀 SERVER START */
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});