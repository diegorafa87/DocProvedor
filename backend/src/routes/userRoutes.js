const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Endpoint temporário para listar todos os usuários
router.get('/all', userController.listAllUsers);

// Rota para criar novo usuário direto no sistema
router.post('/criar', userController.criarUsuario);

// Rota para login do cliente (com validação)
router.post('/login', userController.login);

// Rota para criar/atualizar consultoria do usuário
router.post('/set-consultoria', userController.setUserConsultoria);
router.get('/consultoria', userController.getUserConsultoria);

// Rotas para validação de clientes pela consultoria
router.get('/clientes', userController.getClientes); // Listar clientes não validados
router.post('/validar-cliente', userController.validarCliente); // Validar um cliente

module.exports = router;
