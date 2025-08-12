# TimeGuard – Timesheet Validator
<img width="611" height="596" alt="Screenshot 2025-08-12 203900" src="https://github.com/user-attachments/assets/d94e8ddb-5a09-4e21-8942-323f224cedf8" />
<img width="582" height="189" alt="Screenshot 2025-08-12 203917" src="https://github.com/user-attachments/assets/b627431a-43cb-41db-bdc1-2da603c3e018" />



**TimeGuard** is a web application that validates timesheet CSV data against calendar events (mocked in this project) to detect discrepancies.  
It highlights **extra** and **missing** time entries and presents the results in a clear dashboard.

---

## 📌 Features
- Upload a **CSV timesheet** via a web dashboard.
- Compare entries with mock calendar events.
- Identify **extra hours** and **missing hours**.
- Color-coded and tabular report display.
- Backend API for CSV parsing, validation, and report generation.
- Mock calendar API for development/testing.
- Frontend built with **React + Vite**.
- Backend built with **Node.js + Express**.

---

## 🛠 Tech Stack
**Frontend:** React, Vite, CSS  
**Backend:** Node.js, Express, Nodemon  
**Data:** CSV parser, Mock JSON Calendar data  

---
timeguard/
│
├── backend/
│ ├── sample_data/ # Sample CSV & mock calendar
│ ├── src/
│ │ ├── mocks/ # Mock JSON calendar events
│ │ ├── csvParser.js # CSV parsing logic
│ │ ├── server.js # Express server
│ │ └── validators.js # Validation logic
│ ├── package.json
│
├── frontend/
│ ├── ui/
│ │ ├── src/ # React components
│ │ ├── public/ # Static assets
│ │ ├── index.html
│ │ ├── package.json
│
└── README.md

yaml
Copy
Edit

---

## 🚀 Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/YaminiMakala/TimeGuard-.git
cd TimeGuard-
2️⃣ Backend Setup
bash
Copy
Edit
cd backend
npm install
npm run dev
Backend will start at: http://localhost:3000

3️⃣ Frontend Setup
bash
Copy
Edit
cd ../frontend/ui
npm install
npm run dev
Frontend will start at: http://localhost:5173

📜 API Endpoints
1. Upload Timesheet
POST /timesheets
Upload CSV with:

csv
Copy
Edit
date,start,end,project
2025-08-01,09:30,10:00,Project A
...
2. Get Calendar Events (Mock)
GET /calendar/events?date=YYYY-MM-DD

3. Get Report by ID
GET /reports/{id}
Returns JSON:

json
Copy
Edit
{
  "missingEntries": [
    { "start": "09:00", "end": "09:30", "minutes": 30 }
  ],
  "extraEntries": [
    { "start": "15:00", "end": "17:30", "minutes": 150 }
  ]
}
📊 Sample UI
Upload Timesheet

Validation Report


📦 Sample Data
sample_timesheet.csv → Example CSV file for testing

calendar.json → Mock calendar events

🧪 Testing
Run backend unit tests:

bash
Copy
Edit
cd backend
npm test

## 📂 Project Structure
