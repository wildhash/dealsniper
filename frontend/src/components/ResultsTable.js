import React, { useCallback, useEffect, useRef, useState } from 'react';
import './ResultsTable.css';

const buildMessageText = ({ email, linkedIn, followUp }) => {
  return [
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
};

function ResultsTable({ results, onExport }) {
  const [messageViewer, setMessageViewer] = useState(null);
  const [copyStatus, setCopyStatus] = useState('');
  const closeButtonRef = useRef(null);
  const dialogRef = useRef(null);
  const lastActiveElementRef = useRef(null);

  const closeViewer = useCallback(() => {
    setMessageViewer(null);
    setCopyStatus('');
    const el = lastActiveElementRef.current;
    if (el && typeof el.focus === 'function') {
      el.focus();
    }
  }, []);

  useEffect(() => {
    if (messageViewer) {
      closeButtonRef.current?.focus();
    }
  }, [messageViewer]);

  const handleDialogKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      closeViewer();
      return;
    }

    if (e.key !== 'Tab') return;
    if (!dialogRef.current) return;

    const focusable = Array.from(
      dialogRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.hasAttribute('disabled'));

    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

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

  const openMessages = (result) => {
    lastActiveElementRef.current = document.activeElement;
    const company = result?.company?.name || result?.company?.domain || 'N/A';
    const text = result?.messages
      ? buildMessageText(result.messages)
      : 'No messages generated for this result.';
    setCopyStatus('');
    setMessageViewer({ company, text });
  };

  const copyMessages = async () => {
    if (!messageViewer?.text) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(messageViewer.text);
        setCopyStatus('Copied');
        return;
      }

      const textarea = document.createElement('textarea');
      textarea.value = messageViewer.text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);

      try {
        textarea.focus();
        textarea.select();
        const ok = document.execCommand('copy');
        setCopyStatus(ok ? 'Copied' : 'Copy failed. Select the text and copy it manually.');
      } finally {
        document.body.removeChild(textarea);
      }
    } catch (err) {
      console.error('Failed to copy messages:', err);
      setCopyStatus('Copy failed. Select the text and copy it manually.');
    }
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
            {results.map((result, index) => {
              const baseKey =
                result.id ??
                [
                  result.company?.domain ?? 'no-domain',
                  result.company?.name ?? 'no-name',
                  result.contact?.email ?? 'no-email',
                  result.contact?.firstName ?? '',
                  result.contact?.lastName ?? '',
                ].join('|');

              const rowKey = result.id ? baseKey : `${baseKey}|${index}`;

              return (
                <tr key={rowKey}>
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
                    <button className="btn btn-small" onClick={() => openMessages(result)}>
                      View Messages
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {messageViewer && (
        <div
          className="message-viewer-backdrop"
          onClick={closeViewer}
        >
          <div
            ref={dialogRef}
            className="message-viewer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="message-viewer-title"
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleDialogKeyDown}
          >
            <div className="message-viewer-header">
              <h3 id="message-viewer-title">Messages: {messageViewer.company}</h3>
              <button
                ref={closeButtonRef}
                className="btn btn-small"
                onClick={closeViewer}
              >
                Close
              </button>
            </div>
            <pre className="message-viewer-body">{messageViewer.text}</pre>
            <div className="message-viewer-actions">
              <button className="btn" onClick={copyMessages}>
                Copy
              </button>
              {copyStatus && <span className="copy-status">{copyStatus}</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultsTable;
