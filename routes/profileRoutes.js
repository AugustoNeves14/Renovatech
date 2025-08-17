// renovatech-backend/routes/profileRoutes.js

const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware'); // Apenas 'protect' é necessário, qualquer utilizador logado pode aceder ao seu próprio perfil.

// Aplicar o middleware 'protect' a todas as rotas deste ficheiro.
// Isto garante que apenas utilizadores com um token válido possam aceder.
router.use(protect);

// Define as rotas
router.route('/')
    .get(getUserProfile)       // Rota para buscar o perfil do utilizador logado
    .put(updateUserProfile);     // Rota para atualizar o perfil do utilizador logado

module.exports = router;