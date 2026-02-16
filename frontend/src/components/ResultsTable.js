import React from 'react';
import './ResultsTable.css';

function ResultsTable({ results, onExport }) {
  if (!results || results.length === 0) {
    return (
      <div className="results-table empty">
        <p>No results yet. Add companies and process them to see results here.</p>
      </div>
    );
  }

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return '#4CAF50';
    if (grade.startsWith('B')) return '#2196F3';
    if (grade.startsWith('C')) return '#FF9800';
    return '#f44336';
  };

  return (
    <div className="results-table">
      <div className="results-header">
        <h2>📊 Lead Results ({results.length})</h2>
        <div className="export-buttons">
          <button className="btn btn-secondary" onClick={() => onExport('csv')}>
            📥 Export CSV
          </button>
          <button className="btn btn-secondary" onClick={() => onExport('airtable')}>
            📊 Send to Airtable
          </button>
          <button className="btn btn-secondary" onClick={() => onExport('hubspot')}>
            🚀 Send to HubSpot
          </button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Company</th>
              <th>Contact</th>
              <th>Title</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Score</th>
              <th>Grade</th>
              <th>Messages</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={result.id || index}>
                <td className="company-cell">
                  <div className="company-name">{result.company?.name || 'N/A'}</div>
                  {result.company?.domain && (
                    <div className="company-domain">{result.company.domain}</div>
                  )}
                </td>
                <td>
                  {result.contact?.firstName} {result.contact?.lastName}
                </td>
                <td>{result.contact?.title || 'N/A'}</td>
                <td>
                  {result.contact?.email && (
                    <a href={`mailto:${result.contact.email}`}>
                      {result.contact.email}
                    </a>
                  )}
                </td>
                <td>{result.contact?.phone || 'N/A'}</td>
                <td className="score-cell">
                  <div className="score-number">{result.leadScore?.total || 0}</div>
                  <div className="score-breakdown">
                    F:{result.leadScore?.scores?.funding || 0} 
                    H:{result.leadScore?.scores?.hiring || 0}
                    S:{result.leadScore?.scores?.seniority || 0}
                    T:{result.leadScore?.scores?.techFit || 0}
                  </div>
                </td>
                <td>
                  <span 
                    className="grade-badge"
                    style={{ background: getGradeColor(result.leadScore?.grade || 'D') }}
                  >
                    {result.leadScore?.grade || 'D'}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn-small"
                    onClick={() => showMessages(result)}
                  >
                    View Messages
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function showMessages(result) {
  if (!result.messages) {
    alert('No messages generated for this result');
    return;
  }

  const messages = result.messages;
  const messageText = `
📧 EMAIL
Subject: ${messages.email?.subject || 'N/A'}

${messages.email?.body || 'N/A'}

---

💼 LINKEDIN MESSAGE
${messages.linkedIn?.message || 'N/A'}

---

📨 FOLLOW-UP EMAIL
Subject: ${messages.followUp?.subject || 'N/A'}

${messages.followUp?.body || 'N/A'}
  `.trim();

  alert(messageText);
}

export default ResultsTable;
