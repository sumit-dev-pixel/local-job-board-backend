require("dotenv").config(); // Load env variables

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // bodyParser ki zarurat nahi
app.use(express.static("public"));

// =======================
// MySQL Connection
// =======================

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL not found in environment variables");
  process.exit(1);
}

const db = mysql.createConnection(process.env.DATABASE_URL);

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  } else {
    console.log("✅ Connected to Railway MySQL");
  }
});

// =======================
// Routes
// =======================

// GET jobs
app.get("/api/jobs", (req, res) => {
  db.query("SELECT * FROM jobs", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// POST job
app.post("/api/jobs", (req, res) => {
  const { title, company_name, location, salary, job_description } = req.body;

  if (!title || !company_name) {
    return res.status(400).json({ error: "Title and company name are required" });
  }

  const sql = `
    INSERT INTO jobs (title, company_name, location, salary, job_description)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [title, company_name, location, salary, job_description],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ message: "Job posted successfully!" });
    }
  );
});

// =======================
// Server Start
// =======================

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
