const express = require('express');
const router = express.Router();
const fullEnrich = require('../services/fullEnrich');
const dataStore = require('../models/dataStore');

/**
 * POST /api/enrichment/contact
 * Enrich a single contact
 */
router.post('/contact', async (req, res) => {
  try {
    const contactData = req.body;
    
    if (!contactData.firstName || !contactData.lastName || !contactData.company) {
      return res.status(400).json({ 
        error: 'firstName, lastName, and company are required' 
      });
    }

    const enrichedContact = await fullEnrich.enrichContact(contactData);
    
    res.json({
      success: true,
      contact: enrichedContact
    });
  } catch (error) {
    console.error('Error enriching contact:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/enrichment/batch
 * Enrich multiple contacts
 */
router.post('/batch', async (req, res) => {
  try {
    const { contacts } = req.body;
    
    if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
      return res.status(400).json({ error: 'Contacts array is required' });
    }

    const enrichedContacts = await fullEnrich.enrichContacts(contacts);
    
    res.json({
      success: true,
      count: enrichedContacts.length,
      contacts: enrichedContacts
    });
  } catch (error) {
    console.error('Error enriching contacts:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
