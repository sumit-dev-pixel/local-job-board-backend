const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static('public'));

// ================= DATABASE CONNECTION =================
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Root",
  database: "job_portal"
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed", err);
  } else {
    console.log("Connected to MySQL");
  }
});


// ================= SIGNUP =================
app.post('/signup', (req, res) => {

    const { name, email, password, role } = req.body;

    const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";

    db.query(sql, [name, email, password, role], (err, result) => {
        if(err){
            return res.status(400).json({ message: "Email already exists" });
        }

        res.json({ message: "Signup Successful" });
    });

});


// ================= LOGIN =================
app.post('/login', (req, res) => {

    const { email, password, role } = req.body;

    const sql = "SELECT * FROM users WHERE email = ? AND password = ? AND role = ?";

    db.query(sql, [email, password, role], (err, result) => {

        if(err) return res.status(500).json({ message: "Server Error" });

        if(result.length > 0){
            res.json({ message: "Login Successful", user: result[0] });
        } else {
            res.status(401).json({ message: "Invalid credentials or role" });
        }

    });

});


// ================= GET ALL JOBS =================
app.get('/api/jobs', (req, res) => {
    db.query('SELECT * FROM jobs', (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Server Error" });
        }
        res.json(results);
    });
});


// ================= POST NEW JOB =================

app.post('/api/jobs', (req, res) => {
    const { title, company_name, location, salary, job_description, employer_id } = req.body;

    // Check if employer_id exists
    if (!employer_id) {
        return res.status(401).json({ message: "Please login as Employer first!" });
    }

    // Verify employer in users table
    const sql = "SELECT * FROM users WHERE id = ? AND role='employer'";
    db.query(sql, [employer_id], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });

        if (result.length === 0) {
            return res.status(403).json({ message: "Access denied! Only Employers can post jobs." });
        }

        // Safe to insert job
        const insertSql = `
            INSERT INTO jobs (title, company_name, location, salary, job_description, employer_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.query(insertSql, [title, company_name, location, salary, job_description, employer_id], (err, insertResult) => {
            if (err) return res.status(500).json({ message: "Database error" });

            res.json({ message: "Job posted successfully!" });
        });
    });
});


// ================= APPLY JOB =================
app.post('/apply', (req, res) => {

    const { job_id, seeker_id, name, email, phone, resume } = req.body;

    const sql = `
        INSERT INTO applications (job_id, seeker_id, name, email, phone, resume)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [job_id, seeker_id, name, email, phone, resume], (err, result) => {
        if(err){
            console.log(err);
            return res.status(500).json({ message: "Error saving application" });
        }

        res.json({ message: "Application saved successfully" });
    });

});


// ================= EMPLOYER VIEW APPLICATIONS =================
app.get("/employer/applications/:employerId", (req, res) => {

    const employerId = req.params.employerId;

    const sql = `
        SELECT applications.*, jobs.title
        FROM applications
        JOIN jobs ON applications.job_id = jobs.id
        WHERE jobs.employer_id = ?
    `;

    db.query(sql, [employerId], (err, result) => {

        if (err) {
            return res.status(500).json({ message: "Server Error" });
        }

        res.json(result);

    });

});


// ================= START SERVER =================
const PORT = 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});