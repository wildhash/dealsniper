const express = require('express');
const router = express.Router();
const dataStore = require('../models/dataStore');
const fullEnrich = require('../services/fullEnrich');
const leadScoring = require('../services/leadScoring');
const messageGeneration = require('../services/messageGeneration');

/**
 * POST /api/companies
 * Add companies to process
 */
router.post('/', async (req, res) => {
  try {
    const { companies, icp, region, targetTech } = req.body;

    if (!companies || companies.length === 0) {
      return res.status(400).json({ error: 'Companies array is required' });
    }

    const addedCompanies = [];

    for (const companyData of companies) {
      const company = dataStore.addCompany({
        ...companyData,
        icp,
        region,
        targetTech: targetTech || []
      });
      addedCompanies.push(company);
    }

    res.json({
      success: true,
      count: addedCompanies.length,
      companies: addedCompanies
    });
  } catch (error) {
    console.error('Error adding companies:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/companies
 * Get all companies
 */
router.get('/', (req, res) => {
  try {
    const companies = dataStore.getCompanies();
    res.json({
      success: true,
      count: companies.length,
      companies
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/companies/process
 * Process companies end-to-end: enrich contacts, score, generate messages
 */
router.post('/process', async (req, res) => {
  try {
    const { companyIds } = req.body;

    if (!companyIds || companyIds.length === 0) {
      return res.status(400).json({ error: 'Company IDs are required' });
    }

    const results = [];

    for (const companyId of companyIds) {
      const company = dataStore.getCompanyById(companyId);
      
      if (!company) {
        console.log(`Company ${companyId} not found, skipping...`);
        continue;
      }

      // Generate or get contacts for this company
      const contacts = company.contacts || [
        {
          firstName: company.contactFirstName || 'John',
          lastName: company.contactLastName || 'Doe',
          company: company.name,
          domain: company.domain
        }
      ];

      for (const contactData of contacts) {
        try {
          // Step 1: Enrich contact via FullEnrich
          const enrichedContact = await fullEnrich.enrichContact(contactData);
          
          // Store contact
          const contact = dataStore.addContact({
            ...enrichedContact,
            companyId: company.id
          });

          // Step 2: Calculate lead score
          const leadScore = leadScoring.calculateScore({
            hasFunding: company.hasFunding,
            fundingAmount: company.fundingAmount,
            isHiring: company.isHiring,
            hiringCount: company.hiringCount,
            seniorityLevel: contactData.seniorityLevel || 'mid',
            techStack: company.techStack || [],
            targetTech: company.targetTech || []
          });

          // Step 3: Generate outreach messages
          const messages = await messageGeneration.generateMessages({
            contact,
            company,
            leadScore,
            triggers: extractTriggers(company, leadScore)
          });

          // Store result
          const result = dataStore.addResult({
            companyId: company.id,
            contactId: contact.id,
            company,
            contact,
            leadScore,
            messages
          });

          results.push(result);

        } catch (error) {
          console.error(`Error processing contact for company ${company.name}:`, error);
        }
      }
    }

    res.json({
      success: true,
      count: results.length,
      results
    });

  } catch (error) {
    console.error('Error processing companies:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Helper: Extract triggers from company data
 */
function extractTriggers(company, leadScore) {
  const triggers = [];
  
  if (company.hasFunding) {
    triggers.push('recent funding');
  }
  if (company.isHiring) {
    triggers.push('hiring actively');
  }
  if (leadScore.scores.techFit > 70) {
    triggers.push('strong tech fit');
  }
  
  return triggers.length > 0 ? triggers : ['growing their business'];
}

module.exports = router;
