const express = require('express');
const router = express.Router();
const { getAllServices, createService, updateService, deleteService } = require('../controllers/servicesController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Rota pública para obter os serviços
router.get('/', getAllServices);

// Rotas protegidas que exigem token de admin para criar, atualizar e apagar
router.post('/', protect, isAdmin, createService);
router.put('/:id', protect, isAdmin, updateService);
router.delete('/:id', protect, isAdmin, deleteService);

module.exports = router;