Local Job Board System:

A web-based Local Job Portal that connects Job Seekers and Employers.
Employers can post jobs and view applications, while job seekers can search and apply for local jobs easily.

This project was developed as part of the TY BSc IT Academic Project.

Features:
Job Seeker-

Register and login as a job seeker

Search jobs by keyword and location

Apply for jobs using resume link

View available job listings

Employer-

Register and login as an employer

Post new job opportunities

View job applications submitted by job seekers

View applicant resume links and directly contact candidates via phone or email for hiring
System Features:

Role-based authentication (Job Seeker / Employer)

Job filtering system

Secure backend APIs

MySQL database integration

Technologies Used
Frontend:

HTML

CSS

JavaScript

Backend:

Node.js

Express.js

Database

MySQL

Project Structure:
local-job-board-backend/
│
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── signup.html
│   ├── find-job.html
│   ├── apply.html
│   └── css files
│
├── backend/
│   ├── server.js
│   ├── routes
│   └── database connection
│
├── database/
│   └── local_job_board.sql
│
└── README.md
How to Run the Project
1 Install Node.js

Download Node.js from
https://nodejs.org

2 Clone the Repository
git clone https://github.com/sumit-dev-pixel/local-job-board-backend.git
3 Install Dependencies
npm install
4 Setup Database

Open MySQL

Import the .sql file

Create the database

5 Run the Server
node server.js

Server will start on:

http://localhost:3000
