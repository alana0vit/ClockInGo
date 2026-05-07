const express = require('express');
const router = express.Router();
const pontoController = require('../controllers/pontoController');

// Rotas de ponto
router.post('/entrada', pontoController.registrarEntrada);
router.post('/saida', pontoController.registrarSaida);
router.get('/:cpf', pontoController.listarPontos);
router.put('/:id', pontoController.atualizarPonto);

module.exports = router;