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

  const getGradeColor = (grade = 'D') => {
    if (grade.startsWith('A')) return '#4CAF50';
    if (grade.startsWith('B')) return '#2196F3';
    if (grade.startsWith('C')) return '#FF9800';
    return '#f44336';
  };

  const showMessages = (result) => {
    if (!result?.messages) {
      alert('No messages generated for this result');
      return;
    }
    const { email, linkedIn, followUp } = result.messages;
    const text = [
      'EMAIL',
      `Subject: ${email?.subject || 'N/A'}`,
      email?.body || 'N/A',
      '---',
      'LINKEDIN',
      linkedIn?.message || 'N/A',
      '---',
      'FOLLOW-UP',
      `Subject: ${followUp?.subject || 'N/A'}`,
      followUp?.body || 'N/A',
    ].join('\n\n');
    alert(text);
  };

  return (
    <div className="results-table">
      <div className="results-header">
        <h2>Lead Results ({results.length})</h2>
        <div className="results-actions">
          <button className="btn" onClick={() => onExport('csv')}>Export CSV</button>
          <button className="btn" onClick={() => onExport('airtable')}>Send to Airtable</button>
          <button className="btn" onClick={() => onExport('hubspot')}>Send to HubSpot</button>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Company</th>
              <th>Domain</th>
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
            {results.map((result) => (
              <tr key={result.id}>
                <td>{result.company?.name || 'N/A'}</td>
                <td>{result.company?.domain || '—'}</td>
                <td>{`${result.contact?.firstName || ''} ${result.contact?.lastName || ''}`.trim() || 'N/A'}</td>
                <td>{result.contact?.title || 'N/A'}</td>
                <td>{result.contact?.email ? <a href={`mailto:${result.contact.email}`}>{result.contact.email}</a> : '—'}</td>
                <td>{result.contact?.phone || '—'}</td>
                <td>
                  <div className="score">
                    <strong>{result.leadScore?.total ?? 0}</strong>
                    <div className="breakdown">
                      F:{result.leadScore?.scores?.funding ?? 0} H:{result.leadScore?.scores?.hiring ?? 0} S:{result.leadScore?.scores?.seniority ?? 0} T:{result.leadScore?.scores?.techFit ?? 0}
                    </div>
                  </div>
                </td>
                <td>
                  <span className="grade" style={{ background: getGradeColor(result.leadScore?.grade) }}>
                    {result.leadScore?.grade || 'D'}
                  </span>
                </td>
                <td>
                  <button className="btn btn-small" onClick={() => showMessages(result)}>
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

export default ResultsTable;
