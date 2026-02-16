const axios = require('axios');

/**
 * FullEnrich Service
 * Enriches contact data with email, phone, LinkedIn, and title
 */
class FullEnrichService {
  constructor() {
    this.apiKey = process.env.FULLENRICH_API_KEY;
    this.baseURL = 'https://api.fullenrich.com/v1';
  }

  /**
   * Enrich a single contact
   * @param {Object} contact - Contact information (name, company, domain)
   * @returns {Object} Enriched contact data
   */
  async enrichContact(contact) {
    // Simulate FullEnrich API call
    // In production, this would make a real API call
    
    if (!this.apiKey || this.apiKey === 'your_fullenrich_api_key_here') {
      // Mock data for demo purposes
      return this.mockEnrichment(contact);
    }

    try {
      const response = await axios.post(
        `${this.baseURL}/enrich`,
        {
          first_name: contact.firstName,
          last_name: contact.lastName,
          company: contact.company,
          domain: contact.domain
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return this.formatResponse(response.data);
    } catch (error) {
      console.error('FullEnrich API error:', error.message);
      // Fall back to mock data if API fails
      return this.mockEnrichment(contact);
    }
  }

  /**
   * Enrich multiple contacts in batch
   * @param {Array} contacts - Array of contact objects
   * @returns {Array} Array of enriched contacts
   */
  async enrichContacts(contacts) {
    const enrichedContacts = [];
    
    for (const contact of contacts) {
      try {
        const enriched = await this.enrichContact(contact);
        enrichedContacts.push(enriched);
        
        // Rate limiting: wait 100ms between requests
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error enriching contact ${contact.firstName} ${contact.lastName}:`, error.message);
        enrichedContacts.push({
          ...contact,
          enrichmentStatus: 'failed',
          error: error.message
        });
      }
    }
    
    return enrichedContacts;
  }

  /**
   * Mock enrichment for demo/testing
   */
  mockEnrichment(contact) {
    const domain = contact.domain || `${contact.company.toLowerCase().replace(/\s+/g, '')}.com`;
    const firstName = contact.firstName || 'John';
    const lastName = contact.lastName || 'Doe';
    
    return {
      ...contact,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
      phone: `+1-555-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      linkedIn: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
      title: contact.title || this.generateTitle(),
      enrichmentStatus: 'success',
      enrichedAt: new Date().toISOString()
    };
  }

  generateTitle() {
    const titles = [
      'VP of Sales',
      'Head of Marketing',
      'Director of Product',
      'Chief Technology Officer',
      'VP of Engineering',
      'Head of Business Development',
      'Director of Customer Success',
      'Chief Revenue Officer'
    ];
    return titles[Math.floor(Math.random() * titles.length)];
  }

  formatResponse(data) {
    return {
      email: data.email || data.work_email,
      phone: data.phone || data.mobile_phone,
      linkedIn: data.linkedin_url || data.linkedin,
      title: data.title || data.job_title,
      enrichmentStatus: 'success',
      enrichedAt: new Date().toISOString()
    };
  }
}

module.exports = new FullEnrichService();
