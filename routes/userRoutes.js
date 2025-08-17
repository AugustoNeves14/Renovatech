// renovatech-backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserRole } = require('../controllers/userController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Aplicar o middleware de proteção e verificação de admin a todas as rotas deste arquivo
router.use(protect, isAdmin);

router.get('/', getAllUsers);
router.put('/:id/role', updateUserRole);

module.exports = router;