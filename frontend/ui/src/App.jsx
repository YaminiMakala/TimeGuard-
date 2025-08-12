import React, { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setReport(null); // reset old report on new file
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please choose a CSV file first.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:3000/timesheets", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setReport(data);
      } else {
        alert("Upload failed: " + data.error);
      }
    } catch (err) {
      alert("Error uploading file: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper to format time nicely
  const formatTime = (time) => {
    return time;
  };

  // Render entries in a table
  const renderEntriesTable = (entries) => (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        marginBottom: "1rem",
      }}
    >
      <thead>
        <tr style={{ backgroundColor: "#eee" }}>
          <th style={{ border: "1px solid #ccc", padding: "8px" }}>Start</th>
          <th style={{ border: "1px solid #ccc", padding: "8px" }}>End</th>
          <th style={{ border: "1px solid #ccc", padding: "8px" }}>Minutes</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry, index) => (
          <tr
            key={index}
            style={{
              backgroundColor: index % 2 === 0 ? "#fafafa" : "#fff",
            }}
          >
            <td style={{ border: "1px solid #ccc", padding: "8px" }}>
              {formatTime(entry.start)}
            </td>
            <td style={{ border: "1px solid #ccc", padding: "8px" }}>
              {formatTime(entry.end)}
            </td>
            <td style={{ border: "1px solid #ccc", padding: "8px" }}>
              {entry.minutes}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  // Render missing entries if present
  const renderMissingEntries = (entries) => {
    if (!entries || entries.length === 0) return <p>None</p>;
    return (
      <ul>
        {entries.map((entry, idx) => (
          <li key={idx}>
            {entry.start} - {entry.end} ({entry.minutes} minutes)
          </li>
        ))}
      </ul>
    );
  };

  // Main render for report details by date
  const renderReportDetails = (details) => {
    if (!details) return <p>No details available.</p>;
    return Object.entries(details).map(([date, data]) => (
      <div
        key={date}
        style={{
          border: "1px solid #ccc",
          borderRadius: "6px",
          padding: "16px",
          marginBottom: "20px",
          backgroundColor: "#fff",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <h3
          style={{
            marginTop: 0,
            color: "#333",
            borderBottom: "1px solid #ddd",
            paddingBottom: "8px",
          }}
        >
          {date}
        </h3>

        <div style={{ marginBottom: "12px" }}>
          <strong>Extra Entries:</strong>
          {data.extraEntries && data.extraEntries.length > 0 ? (
            renderEntriesTable(data.extraEntries)
          ) : (
            <p>None</p>
          )}
        </div>

        <div>
          <strong>Missing Entries:</strong>
          {data.missingEntries && data.missingEntries.length > 0
            ? renderMissingEntries(data.missingEntries)
            : "None"}
        </div>
      </div>
    ));
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#222", marginBottom: "30px" }}>
        TimeGuard – Timesheet Validator
      </h1>

      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{ marginRight: "10px" }}
        />
        <button
          onClick={handleUpload}
          disabled={loading}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            border: "1px solid #222",
            backgroundColor: loading ? "#ccc" : "#222",
            color: "#fff",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Uploading..." : "Upload CSV"}
        </button>
      </div>

      {report && (
        <div
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ marginTop: 0, color: "#444" }}>Report Summary</h2>
          <p>
            <strong>Report ID:</strong> {report.id}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(report.createdAt).toLocaleString()}
          </p>

          <div style={{ marginTop: "30px" }}>
            <h3 style={{ marginBottom: "15px" }}>Details</h3>
            {renderReportDetails(report.details)}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
