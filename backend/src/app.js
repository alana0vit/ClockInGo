const express = require('express');
const cors = require('cors');
const routes = require('./routes'); 
const app = express();

// Middlewares Globais
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas - /api
app.use('/api', routes);

// Rota de Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

module.exports = app;