import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ApiService {
  // Companies
  async addCompanies(data) {
    const response = await axios.post(`${API_BASE_URL}/companies`, data);
    return response.data;
  }

  async getCompanies() {
    const response = await axios.get(`${API_BASE_URL}/companies`);
    return response.data;
  }

  async processCompanies(companyIds) {
    const response = await axios.post(`${API_BASE_URL}/companies/process`, { companyIds });
    return response.data;
  }

  // Enrichment
  async enrichContact(contactData) {
    const response = await axios.post(`${API_BASE_URL}/enrichment/contact`, contactData);
    return response.data;
  }

  async enrichContacts(contacts) {
    const response = await axios.post(`${API_BASE_URL}/enrichment/batch`, { contacts });
    return response.data;
  }

  // Messages
  async generateMessages(data) {
    const response = await axios.post(`${API_BASE_URL}/messages/generate`, data);
    return response.data;
  }

  // Export
  async exportCSV() {
    const response = await axios.get(`${API_BASE_URL}/export/csv`, {
      responseType: 'blob'
    });
    return response.data;
  }

  async sendToWebhooks(resultIds = null) {
    const response = await axios.post(`${API_BASE_URL}/export/webhooks`, { resultIds });
    return response.data;
  }

  async sendToAirtable() {
    const response = await axios.post(`${API_BASE_URL}/export/airtable`);
    return response.data;
  }

  async sendToHubSpot() {
    const response = await axios.post(`${API_BASE_URL}/export/hubspot`);
    return response.data;
  }

  // Health check
  async healthCheck() {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.data;
  }
}

const apiService = new ApiService();
export default apiService;
