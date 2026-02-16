const express = require('express');
const router = express.Router();
const messageGeneration = require('../services/messageGeneration');

/**
 * POST /api/messages/generate
 * Generate outreach messages
 */
router.post('/generate', async (req, res) => {
  try {
    const { contact, company, leadScore, triggers } = req.body;
    
    if (!contact || !company) {
      return res.status(400).json({ 
        error: 'contact and company data are required' 
      });
    }

    const messages = await messageGeneration.generateMessages({
      contact,
      company,
      leadScore,
      triggers: triggers || []
    });
    
    res.json({
      success: true,
      messages
    });
  } catch (error) {
    console.error('Error generating messages:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
