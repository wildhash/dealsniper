const express = require('express');
const router = express.Router();
const exportService = require('../services/export');
const dataStore = require('../models/dataStore');

/**
 * GET /api/export/csv
 * Export results as CSV
 */
router.get('/csv', (req, res) => {
  try {
    const results = dataStore.getResults();
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'No results to export' });
    }

    const csv = exportService.generateCSV(results);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=dealsniper-results.csv');
    res.send(csv);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/export/webhooks
 * Send results to Airtable and HubSpot
 */
router.post('/webhooks', async (req, res) => {
  try {
    const { resultIds } = req.body;
    
    let results;
    if (resultIds && resultIds.length > 0) {
      results = resultIds.map(id => dataStore.getResultById(id)).filter(r => r);
    } else {
      results = dataStore.getResults();
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'No results to export' });
    }

    const webhookResults = await exportService.sendToWebhooks(results);
    
    res.json({
      success: true,
      count: results.length,
      webhooks: webhookResults
    });
  } catch (error) {
    console.error('Error sending to webhooks:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/export/airtable
 * Send results to Airtable only
 */
router.post('/airtable', async (req, res) => {
  try {
    const results = dataStore.getResults();
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'No results to export' });
    }

    const result = await exportService.sendToAirtable(results);
    
    res.json({
      success: result.success,
      ...result
    });
  } catch (error) {
    console.error('Error sending to Airtable:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/export/hubspot
 * Send results to HubSpot only
 */
router.post('/hubspot', async (req, res) => {
  try {
    const results = dataStore.getResults();
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'No results to export' });
    }

    const result = await exportService.sendToHubSpot(results);
    
    res.json({
      success: result.success,
      ...result
    });
  } catch (error) {
    console.error('Error sending to HubSpot:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
