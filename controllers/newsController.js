const pool = require('../config/db');

exports.getAllNews = async (req, res) => {
    try {
        const news = await pool.query("SELECT * FROM news ORDER BY created_at DESC");
        res.json(news.rows);
    } catch (err) { res.status(500).json({ success: false, message: 'Erro no servidor' }); }
};

exports.createNews = async (req, res) => {
    const { title_pt, content_pt, image_url } = req.body;
    try {
        const newItem = await pool.query("INSERT INTO news (title_pt, title_en, content_pt, content_en, image_url) VALUES ($1, $1, $2, $2, $3) RETURNING *", [title_pt, content_pt, image_url]);
        res.status(201).json({ success: true, item: newItem.rows[0] });
    } catch (error) { res.status(500).json({ success: false, message: 'Erro de servidor.' }); }
};

exports.updateNews = async (req, res) => {
    const { id } = req.params;
    const { title_pt, content_pt, image_url } = req.body;
    try {
        const updatedItem = await pool.query(
            "UPDATE news SET title_pt = $1, content_pt = $2, image_url = $3, title_en = $1, content_en = $2 WHERE id = $4 RETURNING *",
            [title_pt, content_pt, image_url, id]
        );
        if (updatedItem.rows.length === 0) return res.status(404).json({ success: false, message: 'Notícia não encontrada.' });
        res.status(200).json({ success: true, item: updatedItem.rows[0] });
    } catch (error) { res.status(500).json({ success: false, message: 'Erro de servidor.' }); }
};

exports.deleteNews = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("DELETE FROM news WHERE id = $1", [id]);
        if (result.rowCount === 0) return res.status(404).json({ success: false, message: 'Notícia não encontrada.' });
        res.status(200).json({ success: true, message: 'Notícia apagada com sucesso!' });
    } catch (error) { res.status(500).json({ success: false, message: 'Erro de servidor.' }); }
};