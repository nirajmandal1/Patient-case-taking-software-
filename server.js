import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;
const DB_FILE = path.join(__dirname, "server", "db.json");

app.use(cors());
app.use(express.json());

// Helper to read DB
const readDB = () => {
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading db.json:", err);
    return { patients: [] };
  }
};

// Helper to write DB
const writeDB = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing db.json:", err);
    return false;
  }
};

// 1. Get all patients in queue
app.get("/api/queue", (req, res) => {
  const db = readDB();
  const normalizedPatients = (db.patients || []).map((p) => {
    const isCompleted = p.consultationStatus === "completed" || p.status === "completed";
    return {
      ...p,
      token: String(p.token),
      consultationStatus: isCompleted ? "completed" : (p.consultationStatus || "incomplete"),
      status: isCompleted ? "completed" : (p.status || "waiting")
    };
  });
  res.json({ success: true, queue: normalizedPatients });
});

// 2. Submit new intake from Patient Kiosk
app.post("/api/intake", (req, res) => {
  const newPatient = req.body;
  if (!newPatient || !newPatient.name) {
    return res.status(400).json({ success: false, message: "Patient data required" });
  }

  const db = readDB();
  // Ensure unique token or update existing
  const existingIdx = db.patients.findIndex((p) => String(p.token) === String(newPatient.token));

  if (existingIdx >= 0) {
    db.patients[existingIdx] = {
      ...db.patients[existingIdx],
      ...newPatient,
      token: String(newPatient.token),
      consultationStatus: newPatient.consultationStatus || db.patients[existingIdx].consultationStatus || "incomplete",
      status: newPatient.status || db.patients[existingIdx].status || "waiting",
      updatedAt: new Date().toISOString()
    };
  } else {
    // Add to the top of the queue
    db.patients.unshift({
      ...newPatient,
      token: String(newPatient.token),
      createdAt: new Date().toISOString(),
      consultationStatus: newPatient.consultationStatus || "incomplete",
      status: newPatient.status || "waiting"
    });
  }

  writeDB(db);
  console.log(`[Server] Saved patient intake: Token #${newPatient.token} (${newPatient.name})`);
  res.json({ success: true, patient: newPatient });
});

// 3. Complete doctor consultation & save Rx notes
app.put("/api/patient/:token/complete", (req, res) => {
  const { token } = req.params;
  const { doctorNotes, consultationStatus, status } = req.body;

  const db = readDB();
  const patient = db.patients.find((p) => String(p.token) === String(token));

  if (!patient) {
    return res.status(404).json({ success: false, message: "Patient not found" });
  }

  const newStatus = consultationStatus || status || "completed";
  patient.status = newStatus;
  patient.consultationStatus = newStatus;
  if (doctorNotes) {
    patient.doctorNotes = doctorNotes;
  }
  patient.completedAt = new Date().toISOString();

  writeDB(db);
  console.log(`[Server] Consultation status set to '${newStatus}' for Token #${token}`);
  res.json({ success: true, patient });
});

// 4. Get single patient by token
app.get("/api/patient/:token", (req, res) => {
  const { token } = req.params;
  const db = readDB();
  const patient = db.patients.find((p) => p.token === token);
  if (!patient) {
    return res.status(404).json({ success: false, message: "Patient not found" });
  }
  res.json({ success: true, patient });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", time: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`[MediKiosk Backend Server] Running on http://localhost:${PORT}`);
});
