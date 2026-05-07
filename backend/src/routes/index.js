const express = require('express');
const router = express.Router();

const funcionarioRoutes = require('./funcionarioRoutes');
const authRoutes = require('./authRoutes');
const pontoRoutes = require('./pontoRoutes');
const departamentoRoutes = require('./departamentoRoutes'); // ← ADICIONAR

router.use('/funcionarios', funcionarioRoutes);
router.use('/auth', authRoutes);
router.use('/ponto', pontoRoutes);
router.use('/departamentos', departamentoRoutes); // ← ADICIONAR

module.exports = router;