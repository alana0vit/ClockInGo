const express = require('express');
const router = express.Router();

// Importar rotas
const funcionarioRoutes = require('./funcionarioRoutes');
const authRoutes = require('./authRoutes');
const pontoRoutes = require('./pontoRoutes');

// Registrar rotas
router.use('/funcionarios', funcionarioRoutes);
router.use('/auth', authRoutes);
router.use('/ponto', pontoRoutes);

module.exports = router;