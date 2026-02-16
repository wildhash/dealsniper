// In-memory storage (replace with database in production)
class DataStore {
  constructor() {
    this.companies = [];
    this.contacts = [];
    this.results = [];
    this.nextId = 1;
  }

  // Companies
  addCompany(company) {
    const newCompany = {
      id: this.nextId++,
      ...company,
      createdAt: new Date().toISOString()
    };
    this.companies.push(newCompany);
    return newCompany;
  }

  getCompanies() {
    return this.companies;
  }

  getCompanyById(id) {
    return this.companies.find(c => c.id === id);
  }

  // Contacts
  addContact(contact) {
    const newContact = {
      id: this.nextId++,
      ...contact,
      createdAt: new Date().toISOString()
    };
    this.contacts.push(newContact);
    return newContact;
  }

  getContacts() {
    return this.contacts;
  }

  getContactsByCompanyId(companyId) {
    return this.contacts.filter(c => c.companyId === companyId);
  }

  // Results
  addResult(result) {
    const newResult = {
      id: this.nextId++,
      ...result,
      createdAt: new Date().toISOString()
    };
    this.results.push(newResult);
    return newResult;
  }

  getResults() {
    return this.results;
  }

  getResultById(id) {
    return this.results.find(r => r.id === id);
  }

  // Clear all data
  clearAll() {
    this.companies = [];
    this.contacts = [];
    this.results = [];
    this.nextId = 1;
  }
}

// Singleton instance
const dataStore = new DataStore();

module.exports = dataStore;
