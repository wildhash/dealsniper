import React, { useState } from 'react';
import './CompanyInput.css';

const parseNumber = (s) => {
  if (!s) return undefined;
  const v = Number.parseFloat(s);
  return Number.isFinite(v) ? v : undefined;
};

const parseIntSafe = (s) => {
  if (!s) return undefined;
  const v = Number.parseInt(s, 10);
  return Number.isFinite(v) ? v : undefined;
};

function CompanyInput({ onSubmit }) {
  const [icp, setIcp] = useState('');
  const [region, setRegion] = useState('');
  const [targetTech, setTargetTech] = useState('');
  const [companiesText, setCompaniesText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const companyLines = companiesText.split('\n').map(l => l.trim()).filter(Boolean);

    const companies = companyLines.map((line, index) => {
      const parts = line.split(',').map(p => p.trim());
      return {
        name: parts[0] || `Company ${index + 1}`,
        domain: parts[1] || undefined,
        description: parts[2] || undefined,
        hasFunding: (parts[3] || '').toLowerCase() === 'yes',
        fundingAmount: parseNumber(parts[4]),
        isHiring: (parts[5] || '').toLowerCase() === 'yes',
        hiringCount: parseIntSafe(parts[6]),
        techStack: (parts[7] ? parts[7].split(';') : []).map(t => t.trim()).filter(Boolean),
      };
    });

    onSubmit({
      companies,
      icp: icp.trim(),
      region: region.trim(),
      targetTech: targetTech.split(',').map(t => t.trim()).filter(Boolean),
    });
  };

  return (
    <div className="company-input">
      <h2>Define ICP & Add Companies</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="icp">Ideal Customer Profile (ICP)</label>
          <input
            id="icp"
            value={icp}
            onChange={(e) => setIcp(e.target.value)}
            placeholder="e.g., B2B SaaS companies with 50-500 employees"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="region">Region</label>
          <input
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
            id="targetTech"
            value={targetTech}
            onChange={(e) => setTargetTech(e.target.value)}
            placeholder="e.g., React, Node.js, AWS"
          />
        </div>

        <div className="form-group">
          <label htmlFor="companies">Companies (one per line)</label>
          <textarea
            id="companies"
            value={companiesText}
            onChange={(e) => setCompaniesText(e.target.value)}
            placeholder={[
              'Simple: Acme Corp',
              'Full: Acme Corp, acme.com, Sales software, yes, 10, yes, 5, React;Node.js',
              'Full: Beta Inc, beta.io, Marketing automation, no, 0, yes, 3, Python;Django',
            ].join('\n')}
            rows={8}
            required
          />
          <small className="help-text">
            Full format: Name, Domain, Description, HasFunding(yes/no), FundingAmount(M), IsHiring(yes/no), HiringCount, TechStack(; separated)
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
