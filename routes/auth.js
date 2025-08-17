const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// @route   POST api/auth/register
// @desc    Registrar um novo usuário
router.post('/register', register);

// @route   POST api/auth/login
// @desc    Autenticar usuário e obter token
router.post('/login', login);

module.exports = router;