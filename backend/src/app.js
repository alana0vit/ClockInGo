const express = require('express');

const app = express();

// Middlewares Globais
app.use(express.json());

// Rota de Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

module.exports = app;