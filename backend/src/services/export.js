const axios = require('axios');

/**
 * Export Service
 * Handles CSV generation and webhook integrations
 */
class ExportService {
  constructor() {
    this.airtableApiKey = process.env.AIRTABLE_API_KEY;
    this.airtableBaseId = process.env.AIRTABLE_BASE_ID;
    this.hubspotApiKey = process.env.HUBSPOT_API_KEY;
  }

  /**
   * Convert results to CSV format
   * @param {Array} results - Array of result objects
   * @returns {String} CSV string
   */
  generateCSV(results) {
    if (!results || results.length === 0) {
      return 'No data to export';
    }

    // Define CSV headers
    const headers = [
      'Company',
      'Contact Name',
      'Title',
      'Email',
      'Phone',
      'LinkedIn',
      'Lead Score',
      'Grade',
      'Funding',
      'Hiring',
      'Seniority',
      'Tech Fit',
      'Email Subject',
      'LinkedIn Message',
      'Follow-up Subject'
    ];

    // Build CSV rows
    const rows = results.map(result => {
      const contact = result.contact || {};
      const company = result.company || {};
      const score = result.leadScore || {};
      const messages = result.messages || {};

      return [
        this.escapeCSV(company.name || ''),
        this.escapeCSV(`${contact.firstName || ''} ${contact.lastName || ''}`),
        this.escapeCSV(contact.title || ''),
        this.escapeCSV(contact.email || ''),
        this.escapeCSV(contact.phone || ''),
        this.escapeCSV(contact.linkedIn || ''),
        score.total || 0,
        score.grade || '',
        score.scores?.funding || 0,
        score.scores?.hiring || 0,
        score.scores?.seniority || 0,
        score.scores?.techFit || 0,
        this.escapeCSV(messages.email?.subject || ''),
        this.escapeCSV(messages.linkedIn?.message || ''),
        this.escapeCSV(messages.followUp?.subject || '')
      ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  }

  /**
   * Escape CSV fields
   */
  escapeCSV(field) {
    if (field === null || field === undefined) return '';
    const str = String(field);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  /**
   * Send data to Airtable
   * @param {Array} results - Results to send
   * @returns {Object} Response from Airtable
   */
  async sendToAirtable(results) {
    if (!this.airtableApiKey || this.airtableApiKey === 'your_airtable_api_key_here') {
      console.log('Airtable integration not configured, skipping...');
      return { success: false, message: 'Airtable not configured' };
    }

    try {
      const records = results.map(result => ({
        fields: {
          'Company': result.company?.name || '',
          'Contact Name': `${result.contact?.firstName || ''} ${result.contact?.lastName || ''}`,
          'Email': result.contact?.email || '',
          'Phone': result.contact?.phone || '',
          'Title': result.contact?.title || '',
          'Lead Score': result.leadScore?.total || 0,
          'Grade': result.leadScore?.grade || '',
          'Email Subject': result.messages?.email?.subject || '',
          'Created': new Date().toISOString()
        }
      }));

      const response = await axios.post(
        `https://api.airtable.com/v0/${this.airtableBaseId}/Leads`,
        { records },
        {
          headers: {
            'Authorization': `Bearer ${this.airtableApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        recordsCreated: response.data.records.length,
        message: 'Successfully sent to Airtable'
      };
    } catch (error) {
      console.error('Airtable webhook error:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Send data to HubSpot
   * @param {Array} results - Results to send
   * @returns {Object} Response from HubSpot
   */
  async sendToHubSpot(results) {
    if (!this.hubspotApiKey || this.hubspotApiKey === 'your_hubspot_api_key_here') {
      console.log('HubSpot integration not configured, skipping...');
      return { success: false, message: 'HubSpot not configured' };
    }

    try {
      const contacts = results.map(result => ({
        properties: {
          email: result.contact?.email || '',
          firstname: result.contact?.firstName || '',
          lastname: result.contact?.lastName || '',
          phone: result.contact?.phone || '',
          jobtitle: result.contact?.title || '',
          company: result.company?.name || '',
          lead_score: result.leadScore?.total || 0,
          hs_lead_status: result.leadScore?.grade || ''
        }
      }));

      const createdContacts = [];
      
      // HubSpot API requires individual contact creation
      for (const contact of contacts) {
        try {
          const response = await axios.post(
            'https://api.hubapi.com/crm/v3/objects/contacts',
            contact,
            {
              headers: {
                'Authorization': `Bearer ${this.hubspotApiKey}`,
                'Content-Type': 'application/json'
              }
            }
          );
          createdContacts.push(response.data);
          
          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (err) {
          console.error(`Error creating contact: ${err.message}`);
        }
      }

      return {
        success: true,
        contactsCreated: createdContacts.length,
        message: 'Successfully sent to HubSpot'
      };
    } catch (error) {
      console.error('HubSpot webhook error:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Send to both Airtable and HubSpot
   */
  async sendToWebhooks(results) {
    const [airtableResult, hubspotResult] = await Promise.all([
      this.sendToAirtable(results),
      this.sendToHubSpot(results)
    ]);

    return {
      airtable: airtableResult,
      hubspot: hubspotResult
    };
  }
}

module.exports = new ExportService();
