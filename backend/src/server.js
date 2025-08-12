// backend/src/server.js
import express from 'express';
import fs from 'fs';
import multer from 'multer';
import cors from 'cors';
import { parseTimesheetCsv } from './csvParser.js';
import { validateOneDate } from './validators.js';

const upload = multer();
const app = express();

// Enable CORS (adjust origin if you want to restrict)
app.use(cors({
  origin: 'http://localhost:5173', // your frontend port
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Load calendar mocks
const calendar = JSON.parse(fs.readFileSync('./src/mocks/calendar.json', 'utf8'));

// Load existing reports if file exists, else empty object
const reportsFilePath = './src/mocks/reports.json';
let reportsStore = {};
if (fs.existsSync(reportsFilePath)) {
  reportsStore = JSON.parse(fs.readFileSync(reportsFilePath, 'utf8'));
}

// Save reports to file
function saveReports() {
  fs.writeFileSync(reportsFilePath, JSON.stringify(reportsStore, null, 2));
}

// POST /timesheets - accepts CSV file or csv string in body
app.post('/timesheets', upload.single('file'), (req, res) => {
  try {
    const csvString = req.file ? req.file.buffer.toString('utf8') : req.body.csv;
    const rows = parseTimesheetCsv(csvString);

    // Group timesheet rows by date
    const byDate = {};
    rows.forEach(r => {
      if (!byDate[r.date]) byDate[r.date] = [];
      byDate[r.date].push(r);
    });

    const report = { id: `r-${Date.now()}`, createdAt: new Date().toISOString(), details: {} };
    for (const date of Object.keys(byDate)) {
      const tsRows = byDate[date];
      const calEvents = calendar[date] || [];
      report.details[date] = validateOneDate(tsRows, calEvents);
    }

    // Save report to store + persist to file
    reportsStore[report.id] = report;
    saveReports();

    res.json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET calendar events
app.get('/calendar/events', (req, res) => {
  const date = req.query.date;
  res.json({ date, events: calendar[date] || [] });
});

// GET a stored report
app.get('/reports/:id', (req, res) => {
  const id = req.params.id;
  const report = reportsStore[id];
  if (!report) return res.status(404).json({ error: 'Report not found' });
  res.json(report);
});

app.listen(3000, () => {
  console.log('✅ Backend running on http://localhost:3000');
});

