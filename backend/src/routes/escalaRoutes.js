const express = require('express');
const router = express.Router();
const escalaController = require('../controllers/escalaController');

router.post('/', escalaController.criarEscala);
router.get('/', escalaController.listarEscalas);
router.get('/:id', escalaController.buscarEscalaPorId);
router.put('/:id', escalaController.atualizarEscala);
router.delete('/:id', escalaController.deletarEscala);

module.exports = router;