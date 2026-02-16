const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const companiesRouter = require('./routes/companies');
const enrichmentRouter = require('./routes/enrichment');
const messagesRouter = require('./routes/messages');
const exportRouter = require('./routes/export');

// Routes
app.use('/api/companies', companiesRouter);
app.use('/api/enrichment', enrichmentRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/export', exportRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`DealSniper API running on port ${PORT}`);
});

module.exports = app;
