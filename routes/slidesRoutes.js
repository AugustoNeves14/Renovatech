// renovatech-backend/routes/slidesRoutes.js
const express = require('express');
const router = express.Router();
// const slidesController = require('../controllers/slidesController'); // Descomente quando o controlador estiver pronto
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Rota pública de exemplo
router.get('/', (req, res) => {
    // Lógica para buscar do banco de dados virá aqui
    res.json([]);
});

// Adicione aqui as rotas protegidas
// router.put('/:id', protect, isAdmin, slidesController.updateSlide);

module.exports = router;