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
    host: 'localhost',
    user: 'root',      // MySQL username
    password: 'Root',      // MySQL password
    database: 'job_portal'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

// API to get all jobs
app.get('/api/jobs', (req, res) => {
    db.query('SELECT * FROM jobs', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// API to post new job
app.post('/api/jobs', (req, res) => {
    const { title, company_name, location, salary, job_description} = req.body;

    const sql = `
        INSERT INTO jobs (title, company_name, location, salary, job_description)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [title, company_name, location, salary, job_description], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send("Database error");
        } else {
            res.json({ message: "Job posted successfully!" });
        }
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});