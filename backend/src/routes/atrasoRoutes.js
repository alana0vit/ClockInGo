const express = require('express');
const router = express.Router();
const atrasoController = require('../controllers/atrasoController');

// Criar atraso manualmente (caso necessário)
router.post('/', atrasoController.criarAtraso);

// Justificar um atraso existente
router.put('/:id/justificar', atrasoController.justificarAtraso);

// Listar atrasos de um funcionário
router.get('/funcionario/:cpf', atrasoController.listarAtrasosPorFuncionario);

// Listar apenas atrasos não justificados
router.get('/funcionario/:cpf/nao-justificados', atrasoController.listarAtrasosNaoJustificados);

module.exports = router;