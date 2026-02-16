import React, { useState } from 'react';
import CompanyInput from './components/CompanyInput';
import ResultsTable from './components/ResultsTable';
import ProcessingStatus from './components/ProcessingStatus';
import apiService from './services/api';
import './App.css';

function App() {
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState('');

  const handleCompanySubmit = async (data) => {
    try {
      setStatus('processing');
      setProgress('Adding companies...');

      // Add companies
      const addResponse = await apiService.addCompanies(data);
      console.log('Companies added:', addResponse);

      setProgress(`Processing ${addResponse.companies.length} companies...`);

      // Process companies (enrich, score, generate messages)
      const companyIds = addResponse.companies.map(c => c.id);
      const processResponse = await apiService.processCompanies(companyIds);
      
      console.log('Processing complete:', processResponse);

      setResults(processResponse.results);
      setStatus('success');
      setProgress('');

      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Error processing companies:', error);
      setStatus('error');
      setProgress('');
      alert(`Error: ${error.message}`);
      
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const handleExport = async (type) => {
    try {
      if (type === 'csv') {
        const blob = await apiService.exportCSV();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dealsniper-results.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        alert('CSV downloaded successfully!');
      } else if (type === 'airtable') {
        const response = await apiService.sendToAirtable();
        alert(response.message || 'Sent to Airtable successfully!');
      } else if (type === 'hubspot') {
        const response = await apiService.sendToHubSpot();
        alert(response.message || 'Sent to HubSpot successfully!');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert(`Export error: ${error.message}`);
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🎯 DealSniper</h1>
        <p className="tagline">Smart Lead Enrichment & Outreach Platform</p>
      </header>

      <main className="app-content">
        <ProcessingStatus status={status} progress={progress} />
        
        <CompanyInput onSubmit={handleCompanySubmit} />
        
        <ResultsTable results={results} onExport={handleExport} />
      </main>

      <footer className="app-footer">
        <p>
          💡 DealSniper helps you find, enrich, score, and reach out to your ideal customers.
          <br />
          <small>Built with React, Node.js, Express, FullEnrich, and OpenAI</small>
        </p>
      </footer>
    </div>
  );
}

export default App;
