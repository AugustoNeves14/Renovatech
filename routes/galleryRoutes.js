// renovatech-backend/routes/galleryRoutes.js
const express = require('express');
const router = express.Router();
// const galleryController = require('../controllers/galleryController'); // Descomente quando o controlador estiver pronto
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Rota pública de exemplo para obter as imagens
router.get('/', (req, res) => {
    // Lógica para buscar do banco de dados virá aqui
    res.json([]); 
});

// Adicione aqui as rotas protegidas de POST, PUT, DELETE quando precisar
// router.post('/', protect, isAdmin, galleryController.createImage);

module.exports = router;