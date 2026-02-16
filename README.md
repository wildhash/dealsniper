# 🎯 DealSniper

DealSniper is a powerful lead enrichment and outreach platform that helps sales teams find, score, and reach out to their ideal customers.

## Recent Updates

**✨ Latest improvements:**
- 🎯 **Pagination & Search**: Results table now supports client-side pagination (10/25/50 per page) and real-time search across company names, contacts, and titles
- 🖼️ **Company Logos**: Visual branding with Clearbit logo integration and initials fallback
- ⚙️ **Configurable Scoring**: Centralized scoring configuration in `backend/src/config/scoringConfig.js` for easy tuning
- ✅ **Test Coverage**: Comprehensive Jest test suite for lead scoring service (45 tests)

## Features

- **ICP Definition**: Define your Ideal Customer Profile with keywords, region, and tech stack requirements
- **Company Input**: Add companies manually or via lightweight search
- **Contact Enrichment**: Automatically enrich contacts with email, phone, title, and LinkedIn via FullEnrich
- **Lead Scoring**: Smart scoring algorithm based on:
  - Funding events
  - Hiring activity
  - Role seniority
  - Tech stack fit
- **AI-Powered Outreach**: Generate personalized messages using OpenAI:
  - Email outreach
  - LinkedIn connection message
  - Follow-up email
- **Export & Integration**: 
  - CSV export
  - Airtable webhook
  - HubSpot integration

## Tech Stack

### Backend
- Node.js + Express
- RESTful API architecture
- In-memory data store (easily replaceable with database)
- Integration with FullEnrich and OpenAI
- Jest for testing

### Frontend
- React
- Modern, responsive UI
- Real-time processing status
- Interactive results table with pagination and search
- Clearbit logo integration

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- API keys for:
  - OpenAI (optional - uses mock data if not provided)
  - FullEnrich (optional - uses mock data if not provided)
  - Airtable (optional)
  - HubSpot (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/wildhash/dealsniper.git
cd dealsniper
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Configure environment variables:

Backend - Create `backend/.env`:
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and add your API keys:
```
OPENAI_API_KEY=your_openai_api_key_here
FULLENRICH_API_KEY=your_fullenrich_api_key_here
AIRTABLE_API_KEY=your_airtable_api_key_here
AIRTABLE_BASE_ID=your_airtable_base_id_here
HUBSPOT_API_KEY=your_hubspot_api_key_here
PORT=3001
NODE_ENV=development
```

Frontend - The `.env` file is already created with default values.

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

The API will be available at `http://localhost:3001`

2. In a new terminal, start the frontend:
```bash
cd frontend
npm start
```

The UI will open at `http://localhost:3000`

### Running Tests

Backend tests are included for lead scoring logic:

```bash
cd backend
npm test
```

To run tests in watch mode:

```bash
npm run test:watch
```

The test suite covers:
- Funding tier boundaries
- Hiring tier boundaries  
- Seniority level mapping
- Tech fit match thresholds
- Grade assignment
- Weighted score calculations

## Usage Guide

### Demo Flow (Loom-Ready)

Follow these steps to demonstrate DealSniper:

1. **Define Your ICP**
   - Enter your Ideal Customer Profile (e.g., "B2B SaaS companies with 50-500 employees")
   - Add keywords (e.g., "sales automation, CRM")
   - Specify region (e.g., "North America")
   - List target technologies (e.g., "React, Node.js, AWS")

2. **Add Companies**
   - Simple format: Just enter company names (one per line)
   - Advanced format: Include full details:
     ```
     Acme Corp, acme.com, Sales software, yes, 10, yes, 5, React;Node.js
     Beta Inc, beta.io, Marketing automation, no, 0, yes, 3, Python;Django
     ```
   - Click "Add Companies & Start Processing"

3. **View Results**
   - Processing status will show progress
   - Results table displays:
     - Company and contact information
     - Enriched data (email, phone, LinkedIn)
     - Lead score (0-100) and grade (A+ to D)
     - Score breakdown (Funding, Hiring, Seniority, Tech Fit)
   - Click "View Messages" to see AI-generated outreach

4. **Export Data**
   - **CSV Export**: Download all results as a CSV file
   - **Send to Airtable**: Push leads to your Airtable base
   - **Send to HubSpot**: Create contacts in HubSpot CRM

### Company Input Format

**Simple format** (just names):
```
Acme Corp
Beta Inc
Gamma Systems
```

**Full format** (comma-separated):
```
Company Name, Domain, Description, HasFunding, FundingAmount, IsHiring, HiringCount, TechStack
```

Example:
```
Acme Corp, acme.com, Sales software, yes, 10, yes, 5, React;Node.js
Beta Inc, beta.io, Marketing automation, no, 0, yes, 3, Python;Django
Gamma Systems, gamma.com, Analytics platform, yes, 25, yes, 12, Go;PostgreSQL
```

Fields:
- **Company Name**: Required
- **Domain**: Company website domain
- **Description**: Brief description
- **HasFunding**: "yes" or "no" - recent funding
- **FundingAmount**: Amount in millions
- **IsHiring**: "yes" or "no" - actively hiring
- **HiringCount**: Number of open positions
- **TechStack**: Semicolon-separated technologies

## API Documentation

### Companies

**POST /api/companies**
Add companies to process
```json
{
  "companies": [
    {
      "name": "Acme Corp",
      "domain": "acme.com",
      "hasFunding": true,
      "fundingAmount": 10,
      "isHiring": true,
      "hiringCount": 5
    }
  ],
  "icp": "B2B SaaS companies",
  "region": "North America",
  "targetTech": ["React", "Node.js"]
}
```

**GET /api/companies**
Get all companies

**POST /api/companies/process**
Process companies end-to-end
```json
{
  "companyIds": [1, 2, 3]
}
```

### Enrichment

**POST /api/enrichment/contact**
Enrich a single contact
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "company": "Acme Corp",
  "domain": "acme.com"
}
```

**POST /api/enrichment/batch**
Enrich multiple contacts
```json
{
  "contacts": [...]
}
```

### Messages

**POST /api/messages/generate**
Generate outreach messages
```json
{
  "contact": {...},
  "company": {...},
  "leadScore": {...},
  "triggers": ["recent funding", "hiring actively"]
}
```

### Export

**GET /api/export/csv**
Download results as CSV

**POST /api/export/webhooks**
Send to both Airtable and HubSpot

**POST /api/export/airtable**
Send to Airtable only

**POST /api/export/hubspot**
Send to HubSpot only

## Lead Scoring Algorithm

DealSniper uses a weighted scoring system with configurable thresholds.

### Configuration

All scoring parameters are centralized in `backend/src/config/scoringConfig.js` for easy tuning:

- **Weights**: Adjust the relative importance of each factor (must sum to 100)
  - Funding (30%): Recent funding events increase score
  - Hiring (25%): Active hiring indicates growth
  - Seniority (25%): Higher seniority = higher score
  - Tech Fit (20%): Match between their tech stack and your target

- **Funding Tiers**: Configurable amount thresholds (in millions)
- **Hiring Tiers**: Adjustable open position counts
- **Seniority Scores**: Customizable role-level scoring
- **Tech Fit Thresholds**: Match rate percentages and scores
- **Grade Thresholds**: Letter grade boundaries for segmentation

### Scoring Details

Score ranges:
- 90-100: Grade A+ (Hot leads)
- 80-89: Grade A (Very strong)
- 70-79: Grade B+ (Strong)
- 60-69: Grade B (Good)
- 50-59: Grade C+ (Moderate)
- 40-49: Grade C (Fair)
- <40: Grade D (Low priority)

## Mock Data

For demo purposes, DealSniper works without API keys:

- **FullEnrich**: Generates realistic mock contact data
- **OpenAI**: Uses template-based message generation
- **Webhooks**: Logs attempts but doesn't send actual data

This allows you to test the full flow before integrating real services.

## Deployment

### Backend Deployment

Deploy to any Node.js hosting platform:
- Heroku
- Railway
- Render
- AWS/GCP/Azure

Set environment variables in your hosting platform.

### Frontend Deployment

Build the production version:
```bash
cd frontend
npm run build
```

Deploy the `build` folder to:
- Netlify
- Vercel
- AWS S3 + CloudFront
- GitHub Pages

Update `REACT_APP_API_URL` to point to your deployed backend.

## Extending DealSniper

### Adding a Database

Replace the in-memory data store with a real database:

1. Install database client (e.g., `pg` for PostgreSQL)
2. Update `backend/src/models/dataStore.js`
3. Add database connection configuration

### Adding More Enrichment Sources

Create new service files in `backend/src/services/`:
- Clearbit
- Hunter.io
- Apollo.io
- etc.

### Custom Lead Scoring

Scoring is fully configurable via `backend/src/config/scoringConfig.js`:

1. **Adjust Weights**: Change the relative importance of each factor (funding, hiring, seniority, techFit)
2. **Modify Tiers**: Update funding amount or hiring count thresholds
3. **Tune Thresholds**: Adjust tech fit match rates or grade boundaries
4. **Add Comments**: Document why you chose specific values for your use case

The scoring service will automatically use your updated configuration without code changes.

## Support

For issues or questions:
- Open an issue on GitHub
- Check the documentation
- Review API responses in browser console

## License

ISC

---

Built with ❤️ for the GTM Hackathon
