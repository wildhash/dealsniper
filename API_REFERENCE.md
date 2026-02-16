# API Reference

Complete API documentation for DealSniper backend.

Base URL: `http://localhost:3001/api`

## Authentication

Currently, no authentication is required. Add authentication middleware for production use.

## Endpoints

### Health Check

#### GET /health
Check if the API is running.

**Response**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-16T01:00:00.000Z"
}
```

---

## Companies

### Add Companies

#### POST /companies
Add one or more companies to process.

**Request Body**
```json
{
  "companies": [
    {
      "name": "Acme Corp",
      "domain": "acme.com",
      "description": "Sales software company",
      "hasFunding": true,
      "fundingAmount": 10,
      "isHiring": true,
      "hiringCount": 5,
      "techStack": ["React", "Node.js", "AWS"]
    }
  ],
  "icp": "B2B SaaS companies with 50-500 employees",
  "region": "North America",
  "targetTech": ["React", "Node.js"]
}
```

**Response**
```json
{
  "success": true,
  "count": 1,
  "companies": [
    {
      "id": 1,
      "name": "Acme Corp",
      "domain": "acme.com",
      "description": "Sales software company",
      "hasFunding": true,
      "fundingAmount": 10,
      "isHiring": true,
      "hiringCount": 5,
      "techStack": ["React", "Node.js", "AWS"],
      "icp": "B2B SaaS companies with 50-500 employees",
      "region": "North America",
      "targetTech": ["React", "Node.js"],
      "createdAt": "2026-02-16T01:00:00.000Z"
    }
  ]
}
```

### Get All Companies

#### GET /companies
Retrieve all companies in the system.

**Response**
```json
{
  "success": true,
  "count": 2,
  "companies": [...]
}
```

### Process Companies

#### POST /companies/process
Process companies end-to-end: enrich contacts, calculate scores, generate messages.

**Request Body**
```json
{
  "companyIds": [1, 2, 3]
}
```

**Response**
```json
{
  "success": true,
  "count": 3,
  "results": [
    {
      "id": 1,
      "companyId": 1,
      "contactId": 1,
      "company": {...},
      "contact": {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@acme.com",
        "phone": "+1-555-123-4567",
        "linkedIn": "https://linkedin.com/in/john-doe",
        "title": "VP of Sales",
        "enrichmentStatus": "success"
      },
      "leadScore": {
        "scores": {
          "funding": 70,
          "hiring": 70,
          "seniority": 80,
          "techFit": 100
        },
        "total": 79,
        "grade": "B+"
      },
      "messages": {
        "email": {
          "subject": "...",
          "body": "...",
          "type": "email"
        },
        "linkedIn": {
          "message": "...",
          "type": "linkedin"
        },
        "followUp": {
          "subject": "...",
          "body": "...",
          "type": "follow-up"
        },
        "generatedAt": "2026-02-16T01:00:00.000Z"
      },
      "createdAt": "2026-02-16T01:00:00.000Z"
    }
  ]
}
```

---

## Enrichment

### Enrich Single Contact

#### POST /enrichment/contact
Enrich a single contact with FullEnrich.

**Request Body**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "company": "Acme Corp",
  "domain": "acme.com"
}
```

**Response**
```json
{
  "success": true,
  "contact": {
    "firstName": "John",
    "lastName": "Doe",
    "company": "Acme Corp",
    "domain": "acme.com",
    "email": "john.doe@acme.com",
    "phone": "+1-555-123-4567",
    "linkedIn": "https://linkedin.com/in/john-doe",
    "title": "VP of Sales",
    "enrichmentStatus": "success",
    "enrichedAt": "2026-02-16T01:00:00.000Z"
  }
}
```

### Enrich Multiple Contacts

#### POST /enrichment/batch
Enrich multiple contacts in batch.

**Request Body**
```json
{
  "contacts": [
    {
      "firstName": "John",
      "lastName": "Doe",
      "company": "Acme Corp",
      "domain": "acme.com"
    },
    {
      "firstName": "Jane",
      "lastName": "Smith",
      "company": "Beta Inc",
      "domain": "beta.io"
    }
  ]
}
```

**Response**
```json
{
  "success": true,
  "count": 2,
  "contacts": [...]
}
```

---

## Messages

### Generate Outreach Messages

#### POST /messages/generate
Generate AI-powered outreach messages.

**Request Body**
```json
{
  "contact": {
    "firstName": "John",
    "lastName": "Doe",
    "title": "VP of Sales",
    "email": "john.doe@acme.com"
  },
  "company": {
    "name": "Acme Corp",
    "description": "Sales software company"
  },
  "leadScore": {
    "total": 79,
    "grade": "B+"
  },
  "triggers": ["recent funding", "hiring actively"]
}
```

**Response**
```json
{
  "success": true,
  "messages": {
    "email": {
      "subject": "Quick question about Acme Corp's growth",
      "body": "Hi John,\n\nI noticed Acme Corp recently...",
      "type": "email"
    },
    "linkedIn": {
      "message": "Hi John, I came across Acme Corp...",
      "type": "linkedin"
    },
    "followUp": {
      "subject": "Following up - Acme Corp",
      "body": "Hi John,\n\nFollowing up on...",
      "type": "follow-up"
    },
    "generatedAt": "2026-02-16T01:00:00.000Z"
  }
}
```

---

## Export

### Export as CSV

#### GET /export/csv
Download all results as a CSV file.

**Response**
- Content-Type: `text/csv`
- Content-Disposition: `attachment; filename=dealsniper-results.csv`

**CSV Format**
```
Company,Contact Name,Title,Email,Phone,LinkedIn,Lead Score,Grade,Funding,Hiring,Seniority,Tech Fit,Email Subject,LinkedIn Message,Follow-up Subject
Acme Corp,John Doe,VP of Sales,john.doe@acme.com,+1-555-123-4567,https://linkedin.com/in/john-doe,79,B+,70,70,80,100,"Quick question...","Hi John...","Following up..."
```

### Send to Webhooks

#### POST /export/webhooks
Send results to both Airtable and HubSpot.

**Request Body** (optional)
```json
{
  "resultIds": [1, 2, 3]
}
```

If `resultIds` is not provided, all results are sent.

**Response**
```json
{
  "success": true,
  "count": 3,
  "webhooks": {
    "airtable": {
      "success": true,
      "recordsCreated": 3,
      "message": "Successfully sent to Airtable"
    },
    "hubspot": {
      "success": true,
      "contactsCreated": 3,
      "message": "Successfully sent to HubSpot"
    }
  }
}
```

### Send to Airtable

#### POST /export/airtable
Send results to Airtable only.

**Response**
```json
{
  "success": true,
  "recordsCreated": 3,
  "message": "Successfully sent to Airtable"
}
```

### Send to HubSpot

#### POST /export/hubspot
Send results to HubSpot only.

**Response**
```json
{
  "success": true,
  "contactsCreated": 3,
  "message": "Successfully sent to HubSpot"
}
```

---

## Lead Scoring Reference

### Scoring Components

**Funding Score (30% weight)**
- $50M+: 100 points
- $20M-49M: 85 points
- $10M-19M: 70 points
- $5M-9M: 60 points
- $1M-4M: 50 points
- Has funding (unknown amount): 40 points
- No funding: 0 points

**Hiring Score (25% weight)**
- 20+ open positions: 100 points
- 10-19 open positions: 85 points
- 5-9 open positions: 70 points
- 2-4 open positions: 60 points
- 1 open position: 50 points
- Not hiring: 20 points (base score)

**Seniority Score (25% weight)**
- Executive (C-level, VP): 100 points
- Senior (Director, Senior Manager): 80 points
- Mid (Manager, Senior IC): 60 points
- Junior (Entry level): 40 points
- Unknown: 30 points

**Tech Fit Score (20% weight)**
- 80%+ match: 100 points
- 60-79% match: 85 points
- 40-59% match: 70 points
- 20-39% match: 55 points
- <20% match: 40 points
- No tech stack data: 30 points
- No requirements: 50 points

### Grade Thresholds

- A+ (90-100): Hot leads, immediate action
- A (80-89): Very strong leads
- B+ (70-79): Strong leads
- B (60-69): Good leads
- C+ (50-59): Moderate leads
- C (40-49): Fair leads
- D (<40): Low priority leads

---

## Error Responses

All endpoints may return error responses:

**400 Bad Request**
```json
{
  "error": "Company IDs are required"
}
```

**404 Not Found**
```json
{
  "error": "No results to export"
}
```

**500 Internal Server Error**
```json
{
  "error": "Something went wrong!",
  "message": "Detailed error message"
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting for production:
- API rate limiting middleware
- FullEnrich API rate limiting (100ms between requests)
- OpenAI API rate limiting (per API tier)

---

## Mock Data Mode

When API keys are not configured or set to placeholder values, the system operates in mock data mode:

- **FullEnrich**: Generates realistic contact data
- **OpenAI**: Uses template-based message generation
- **Webhooks**: Logs attempts without sending data

This allows full testing without external API dependencies.
