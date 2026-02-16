# 🎯 DealSniper - Project Summary

## Overview
DealSniper is a complete web application for B2B sales teams to find, enrich, score, and reach out to their ideal customers.

## Architecture

```
dealsniper/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── index.js        # Main server file
│   │   ├── models/         # Data models
│   │   │   └── dataStore.js
│   │   ├── routes/         # API routes
│   │   │   ├── companies.js
│   │   │   ├── enrichment.js
│   │   │   ├── messages.js
│   │   │   └── export.js
│   │   ├── services/       # Business logic
│   │   │   ├── fullEnrich.js
│   │   │   ├── leadScoring.js
│   │   │   ├── messageGeneration.js
│   │   │   └── export.js
│   │   └── utils/          # Helper functions
│   ├── package.json
│   └── .env.example
│
├── frontend/               # React application
│   ├── src/
│   │   ├── App.js         # Main app component
│   │   ├── components/    # UI components
│   │   │   ├── CompanyInput.js
│   │   │   ├── ResultsTable.js
│   │   │   └── ProcessingStatus.js
│   │   └── services/      # API client
│   │       └── api.js
│   ├── package.json
│   └── .env
│
├── README.md              # Main documentation
├── DEMO_GUIDE.md          # Loom recording guide
└── API_REFERENCE.md       # Complete API docs
```

## Features Matrix

| Feature | Status | Description |
|---------|--------|-------------|
| ICP Definition | ✅ | Define ideal customer profile with keywords, region, tech |
| Company Input | ✅ | Add companies manually with flexible format |
| Contact Enrichment | ✅ | Enrich via FullEnrich API (with mock fallback) |
| Lead Scoring | ✅ | Intelligent scoring: funding, hiring, seniority, tech fit |
| Message Generation | ✅ | AI-powered via OpenAI (with mock fallback) |
| Results Dashboard | ✅ | Interactive table with scores and grades |
| CSV Export | ✅ | Download results as spreadsheet |
| Airtable Integration | ✅ | Send to Airtable via webhook |
| HubSpot Integration | ✅ | Send to HubSpot CRM |
| Mock Data Mode | ✅ | Works without API keys for demos |

## Data Flow

1. **Input**: User defines ICP and adds companies
2. **Enrichment**: Contact data enriched via FullEnrich
3. **Scoring**: Lead score calculated based on multiple factors
4. **Generation**: AI generates 3 personalized messages
5. **Output**: Results displayed and exported

## API Endpoints

### Companies
- `POST /api/companies` - Add companies
- `GET /api/companies` - Get all companies
- `POST /api/companies/process` - Process end-to-end

### Enrichment
- `POST /api/enrichment/contact` - Enrich single contact
- `POST /api/enrichment/batch` - Enrich multiple contacts

### Messages
- `POST /api/messages/generate` - Generate outreach messages

### Export
- `GET /api/export/csv` - Download CSV
- `POST /api/export/webhooks` - Send to both webhooks
- `POST /api/export/airtable` - Send to Airtable
- `POST /api/export/hubspot` - Send to HubSpot

## Lead Scoring Algorithm

### Components (Weighted)
1. **Funding (30%)**: Recent funding events
2. **Hiring (25%)**: Active hiring activity
3. **Seniority (25%)**: Contact role level
4. **Tech Fit (20%)**: Tech stack alignment

### Grades
- A+ (90-100): Hot leads
- A (80-89): Very strong
- B+ (70-79): Strong
- B (60-69): Good
- C+ (50-59): Moderate
- C (40-49): Fair
- D (<40): Low priority

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **HTTP Client**: Axios
- **AI**: OpenAI API
- **Enrichment**: FullEnrich API

### Frontend
- **Framework**: React
- **Styling**: CSS (custom)
- **HTTP Client**: Axios
- **State**: React Hooks (useState)

### Infrastructure
- In-memory data store (easily replaceable with database)
- CORS enabled for local development
- Environment-based configuration

## External Integrations

### FullEnrich
- Purpose: Contact enrichment
- Data: Email, phone, LinkedIn, title
- Fallback: Mock data generation

### OpenAI
- Purpose: Message generation
- Model: GPT-4
- Fallback: Template-based generation

### Airtable
- Purpose: CRM integration
- Method: REST API webhook
- Fallback: Logs without sending

### HubSpot
- Purpose: CRM integration
- Method: REST API webhook
- Fallback: Logs without sending

## Configuration

### Backend Environment Variables
```
OPENAI_API_KEY=<your_key>
FULLENRICH_API_KEY=<your_key>
AIRTABLE_API_KEY=<your_key>
AIRTABLE_BASE_ID=<your_base_id>
HUBSPOT_API_KEY=<your_key>
PORT=3001
NODE_ENV=development
```

### Frontend Environment Variables
```
REACT_APP_API_URL=http://localhost:3001/api
```

## Development Commands

### Backend
```bash
cd backend
npm install
npm start        # Production
npm run dev      # Development with nodemon
```

### Frontend
```bash
cd frontend
npm install
npm start        # Development server
npm run build    # Production build
```

## Testing Approach

### Manual Testing
- ✅ Backend API endpoints tested via curl
- ✅ Frontend UI tested via browser
- ✅ End-to-end flow tested via UI
- ✅ Export functionality verified
- ✅ Mock data mode tested

### Security
- ✅ CodeQL scan: 0 vulnerabilities
- ✅ No hardcoded secrets
- ✅ Environment variables for sensitive data
- ✅ CORS configured

### Code Quality
- ✅ Code review passed
- ✅ Consistent code style
- ✅ Clear separation of concerns
- ✅ Error handling implemented

## Production Readiness

### Completed
- ✅ Core functionality
- ✅ Documentation
- ✅ Demo guide
- ✅ API reference
- ✅ Error handling
- ✅ Mock data fallbacks
- ✅ Security scan

### Recommended for Production
- [ ] Replace in-memory store with database (PostgreSQL/MongoDB)
- [ ] Add authentication and authorization
- [ ] Implement rate limiting
- [ ] Add request validation middleware
- [ ] Set up logging (Winston/Morgan)
- [ ] Add unit and integration tests
- [ ] Set up CI/CD pipeline
- [ ] Configure production environment
- [ ] Add monitoring and alerting
- [ ] Implement caching (Redis)
- [ ] Add API documentation (Swagger/OpenAPI)

## Deployment Options

### Backend
- Heroku
- Railway
- Render
- AWS (EC2, Elastic Beanstalk, Lambda)
- Google Cloud (App Engine, Cloud Run)
- Azure (App Service)

### Frontend
- Netlify
- Vercel
- AWS S3 + CloudFront
- GitHub Pages
- Firebase Hosting

## Extension Ideas

### Features
- Real-time search/filtering of results
- Historical data and analytics
- Bulk processing queue
- Email/LinkedIn tracking
- A/B testing for messages
- Custom scoring weights
- Saved ICP templates
- Team collaboration

### Integrations
- More enrichment sources (Clearbit, Hunter.io, Apollo)
- More CRM integrations (Salesforce, Pipedrive)
- Email sending (SendGrid, Mailgun)
- Slack notifications
- Zapier webhooks

### Technical Improvements
- GraphQL API option
- Real-time updates (WebSockets)
- Background job processing
- File upload for bulk companies
- Advanced filtering and search
- Data visualization charts
- PDF report generation

## Support & Maintenance

### Documentation
- README.md: Setup and usage
- DEMO_GUIDE.md: Recording walkthrough
- API_REFERENCE.md: Complete API docs

### Code Organization
- Clear folder structure
- Modular services
- Reusable components
- Consistent naming

### Maintainability
- Easy to understand
- Well-commented where needed
- Extensible architecture
- Mock data for testing

## License
ISC

## Contributing
Open to contributions! See documentation for setup instructions.

---

Built with ❤️ for the GTM Hackathon
