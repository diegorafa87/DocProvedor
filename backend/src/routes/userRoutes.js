const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Endpoint temporário para listar todos os usuários
router.get('/all', userController.listAllUsers);

// Rota para criar novo usuário direto no sistema
router.post('/criar', userController.criarUsuario);

// Rota para criar/atualizar consultoria do usuário
router.post('/set-consultoria', userController.setUserConsultoria);
router.get('/consultoria', userController.getUserConsultoria);

module.exports = router;
