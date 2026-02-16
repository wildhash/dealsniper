import React, { useEffect, useRef, useState } from 'react';
import CompanyInput from './components/CompanyInput';
import ResultsTable from './components/ResultsTable';
import ProcessingStatus from './components/ProcessingStatus';
import apiService from './services/api';
import './App.css';

const STATUS_RESET_DELAY_MS = 3000;

function App() {
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState('');
  const statusResetTimeoutRef = useRef(null);

  const clearStatusResetTimeout = () => {
    if (statusResetTimeoutRef.current) {
      clearTimeout(statusResetTimeoutRef.current);
      statusResetTimeoutRef.current = null;
    }
  };

  const scheduleStatusReset = () => {
    clearStatusResetTimeout();
    statusResetTimeoutRef.current = setTimeout(() => {
      statusResetTimeoutRef.current = null;
      setStatus('idle');
    }, STATUS_RESET_DELAY_MS);
  };

  useEffect(() => {
    return () => clearStatusResetTimeout();
  }, []);

  const handleCompanySubmit = async (data) => {
    try {
      clearStatusResetTimeout();
      setStatus('processing');
      setProgress('Adding companies...');

      const addResponse = await apiService.addCompanies(data);
      setProgress(`Processing ${addResponse.companies.length} companies...`);

      const companyIds = addResponse.companies.map((c) => c.id);
      const processResponse = await apiService.processCompanies(companyIds);

      setResults(processResponse.results || []);
      setStatus('success');
      setProgress('');
      scheduleStatusReset();
    } catch (error) {
      console.error('Error processing companies:', error);
      setStatus('error');
      setProgress('');
      alert(`Error: ${error?.message || 'Unknown error'}`);
      scheduleStatusReset();
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
      } else if (type === 'airtable') {
        const response = await apiService.sendToAirtable();
        alert(response.message || 'Sent to Airtable successfully!');
      } else if (type === 'hubspot') {
        const response = await apiService.sendToHubSpot();
        alert(response.message || 'Sent to HubSpot successfully!');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert(`Export error: ${error?.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>DealSniper</h1>
        <p className="tagline">Revenue-before-intent lead enrichment, scoring, and outreach</p>
      </header>

      <main className="app-content">
        <ProcessingStatus status={status} progress={progress} />
        <CompanyInput onSubmit={handleCompanySubmit} />
        <ResultsTable results={results} onExport={handleExport} />
      </main>

      <footer className="app-footer">
        <p>
          Built with React + Node/Express • FullEnrich enrichment • OpenAI message generation
        </p>
        <small>Hackathon demo build</small>
      </footer>
    </div>
  );
}

export default App;
