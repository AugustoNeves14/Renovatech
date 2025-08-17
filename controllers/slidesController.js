const pool = require('../config/db');

// Obter todos os slides ativos
exports.getActiveSlides = async (req, res) => {
    try {
        const lang = req.query.lang === 'en' ? 'en' : 'pt';
        const titleField = `title_${lang}`;
        const subtitleField = `subtitle_${lang}`;

        const slides = await pool.query(
            `SELECT id, image_url, ${titleField} as title, ${subtitleField} as subtitle, link_url FROM slides WHERE is_active = true`
        );
        res.json(slides.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
};