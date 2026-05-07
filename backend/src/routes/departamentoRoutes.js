const express = require('express');
const router = express.Router();
const departamentoController = require('../controllers/departamentoController');

router.post('/', departamentoController.criarDepartamento);
router.get('/', departamentoController.listarDepartamentos);
router.get('/:id', departamentoController.buscarDepartamentoPorId);
router.put('/:id', departamentoController.atualizarDepartamento);
router.delete('/:id', departamentoController.deletarDepartamento);

module.exports = router;