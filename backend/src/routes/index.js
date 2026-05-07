const express = require('express');
const router = express.Router();

const funcionarioRoutes = require('./funcionarioRoutes');
const authRoutes = require('./authRoutes');
const pontoRoutes = require('./pontoRoutes');
const departamentoRoutes = require('./departamentoRoutes');
const atrasoRoutes = require('./atrasoRoutes');
const escalaRoutes = require('./escalaRoutes');

router.use('/funcionarios', funcionarioRoutes);
router.use('/auth', authRoutes);
router.use('/ponto', pontoRoutes);
router.use('/departamentos', departamentoRoutes);
router.use('/atrasos', atrasoRoutes);
router.use('/escalas', escalaRoutes);

module.exports = router;