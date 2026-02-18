const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// MySQL connection
const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("MySQL Connected...");
  }
});

// GET jobs
app.get('/api/jobs', (req, res) => {
  db.query('SELECT * FROM jobs', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// POST job
app.post('/api/jobs', (req, res) => {
  const { title, company_name, location, salary, job_description } = req.body;

  const sql = `
    INSERT INTO jobs (title, company_name, location, salary, job_description)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [title, company_name, location, salary, job_description], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "Job posted successfully!" });
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
