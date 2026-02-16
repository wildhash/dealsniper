import React, { useState, useMemo } from 'react';
import './ResultsTable.css';

function ResultsTable({ results, onExport }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return '#4CAF50';
    if (grade.startsWith('B')) return '#2196F3';
    if (grade.startsWith('C')) return '#FF9800';
    return '#f44336';
  };

  // Filter results based on search term
  const filteredResults = useMemo(() => {
    if (!results || results.length === 0) return [];
    if (!searchTerm) return results;
    
    const lowerSearch = searchTerm.toLowerCase();
    return results.filter(result => {
      const companyName = result.company?.name?.toLowerCase() || '';
      const companyDomain = result.company?.domain?.toLowerCase() || '';
      const contactName = `${result.contact?.firstName || ''} ${result.contact?.lastName || ''}`.toLowerCase();
      const contactTitle = result.contact?.title?.toLowerCase() || '';
      
      return companyName.includes(lowerSearch) ||
             companyDomain.includes(lowerSearch) ||
             contactName.includes(lowerSearch) ||
             contactTitle.includes(lowerSearch);
    });
  }, [results, searchTerm]);

  // Paginate filtered results
  const totalPages = Math.ceil(filteredResults.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedResults = filteredResults.slice(startIndex, endIndex);

  // Reset to page 1 when search term or page size changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const getCompanyInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!results || results.length === 0) {
    return (
      <div className="results-table empty">
        <p>No results yet. Add companies and process them to see results here.</p>
      </div>
    );
  }

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

      <div className="table-controls">
        <input
          type="text"
          placeholder="🔍 Search by company, contact name, or title..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <div className="pagination-controls">
          <label>
            Show
            <select value={pageSize} onChange={handlePageSizeChange} className="page-size-select">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            per page
          </label>
        </div>
      </div>

      <div className="table-info">
        Showing {startIndex + 1}-{Math.min(endIndex, filteredResults.length)} of {filteredResults.length} results
        {searchTerm && ` (filtered from ${results.length} total)`}
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Logo</th>
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
            {paginatedResults.map((result, index) => (
              <tr key={result.id || index}>
                <td className="logo-cell">
                  {result.company?.domain ? (
                    <img
                      src={`https://logo.clearbit.com/${result.company.domain}`}
                      alt={`${result.company.name} logo`}
                      className="company-logo"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="logo-fallback" style={{ display: result.company?.domain ? 'none' : 'flex' }}>
                    {getCompanyInitials(result.company?.name)}
                  </div>
                </td>
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

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="pagination-btn"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ← Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            className="pagination-btn"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      )}
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
