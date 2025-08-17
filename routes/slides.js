const express = require('express');
const router = express.Router();
const { getActiveSlides } = require('../controllers/slidesController');

// @route   GET api/slides
// @desc    Obter todos os slides ativos (suporta ?lang=en ou ?lang=pt)
router.get('/', getActiveSlides);

module.exports = router;