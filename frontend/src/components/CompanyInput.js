import React, { useState } from 'react';
import './CompanyInput.css';

function CompanyInput({ onSubmit }) {
  const [icp, setIcp] = useState('');
  const [keywords, setKeywords] = useState('');
  const [region, setRegion] = useState('');
  const [targetTech, setTargetTech] = useState('');
  const [companiesText, setCompaniesText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Parse companies from text (one per line)
    const companyLines = companiesText.split('\n').filter(line => line.trim());
    
    const companies = companyLines.map((line, index) => {
      const parts = line.split(',').map(p => p.trim());
      return {
        name: parts[0] || `Company ${index + 1}`,
        domain: parts[1] || undefined,
        description: parts[2] || undefined,
        hasFunding: parts[3]?.toLowerCase() === 'yes',
        fundingAmount: parseFloat(parts[4]) || 0,
        isHiring: parts[5]?.toLowerCase() === 'yes',
        hiringCount: parseInt(parts[6]) || 0,
        techStack: parts[7]?.split(';').map(t => t.trim()) || []
      };
    });

    const data = {
      companies,
      icp: icp.trim(),
      region: region.trim(),
      targetTech: targetTech.split(',').map(t => t.trim()).filter(t => t)
    };

    onSubmit(data);
  };

  return (
    <div className="company-input">
      <h2>🎯 Define Your ICP & Add Companies</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="icp">Ideal Customer Profile (ICP)</label>
          <input
            type="text"
            id="icp"
            value={icp}
            onChange={(e) => setIcp(e.target.value)}
            placeholder="e.g., B2B SaaS companies with 50-500 employees"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="keywords">Keywords</label>
          <input
            type="text"
            id="keywords"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="e.g., sales automation, CRM, outbound"
          />
        </div>

        <div className="form-group">
          <label htmlFor="region">Region</label>
          <input
            type="text"
            id="region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            placeholder="e.g., North America, EU, APAC"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="targetTech">Target Tech Stack (comma-separated)</label>
          <input
            type="text"
            id="targetTech"
            value={targetTech}
            onChange={(e) => setTargetTech(e.target.value)}
            placeholder="e.g., React, Node.js, AWS"
          />
        </div>

        <div className="form-group">
          <label htmlFor="companies">
            Companies (one per line, format: Name, Domain, Description, HasFunding, FundingAmount, IsHiring, HiringCount, TechStack)
          </label>
          <textarea
            id="companies"
            value={companiesText}
            onChange={(e) => setCompaniesText(e.target.value)}
            placeholder="Acme Corp, acme.com, Sales software, yes, 10, yes, 5, React;Node.js&#10;Beta Inc, beta.io, Marketing automation, no, 0, yes, 3, Python;Django"
            rows="8"
            required
          />
          <small className="help-text">
            💡 Simple format: Just company name, or full details separated by commas.
            Example: "Acme Corp, acme.com, Sales software, yes, 10, yes, 5, React;Node.js"
          </small>
        </div>

        <button type="submit" className="btn btn-primary">
          Add Companies & Start Processing
        </button>
      </form>
    </div>
  );
}

export default CompanyInput;
