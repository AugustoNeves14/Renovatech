const pool = require('../config/db');

// ROTA PÚBLICA: Obter todos os serviços
exports.getAllServices = async (req, res) => {
    try {
        const lang = req.query.lang === 'en' ? 'en' : 'pt';
        const titleField = `title_${lang}`;
        const descriptionField = `description_${lang}`;
        const services = await pool.query(`SELECT id, ${titleField} as title, ${descriptionField} as description, price_kwanza FROM services ORDER BY id ASC`);
        res.json(services.rows);
    } catch (err) { res.status(500).send('Erro no servidor'); }
};

// ROTA DE ADMIN: Criar um novo serviço
exports.createService = async (req, res) => {
    const { title_pt, title_en, description_pt, description_en, price_kwanza } = req.body;
    if (!title_pt || !description_pt || !price_kwanza) {
        return res.status(400).json({ success: false, message: 'Título (pt), descrição (pt) e preço são obrigatórios.' });
    }
    try {
        const newService = await pool.query(
            "INSERT INTO services (title_pt, title_en, description_pt, description_en, price_kwanza) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [title_pt, title_en || title_pt, description_pt, description_en || description_pt, price_kwanza]
        );
        res.status(201).json({ success: true, message: 'Serviço criado com sucesso!', service: newService.rows[0] });
    } catch (error) { res.status(500).json({ success: false, message: 'Erro de servidor.' }); }
};

// ROTA DE ADMIN: Atualizar um serviço
exports.updateService = async (req, res) => {
    const { id } = req.params;
    const { title_pt, title_en, description_pt, description_en, price_kwanza } = req.body;
    try {
        const updatedService = await pool.query(
            "UPDATE services SET title_pt = $1, title_en = $2, description_pt = $3, description_en = $4, price_kwanza = $5 WHERE id = $6 RETURNING *",
            [title_pt, title_en, description_pt, description_en, price_kwanza, id]
        );
        if (updatedService.rows.length === 0) return res.status(404).json({ success: false, message: 'Serviço não encontrado.' });
        res.status(200).json({ success: true, message: 'Serviço atualizado com sucesso!', service: updatedService.rows[0] });
    } catch (error) { res.status(500).json({ success: false, message: 'Erro de servidor.' }); }
};

// ROTA DE ADMIN: Apagar um serviço
exports.deleteService = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("DELETE FROM services WHERE id = $1", [id]);
        if (result.rowCount === 0) return res.status(404).json({ success: false, message: 'Serviço não encontrado.' });
        res.status(200).json({ success: true, message: 'Serviço apagado com sucesso!' });
    } catch (error) { res.status(500).json({ success: false, message: 'Erro de servidor.' }); }
};

// ROTA PÚBLICA: Obter todos os serviços (COM NOMES DE COLUNAS CONSISTENTES)
exports.getAllServices = async (req, res) => {
    try {
        const services = await pool.query("SELECT * FROM services ORDER BY id ASC");
        res.status(200).json(services.rows); // Retorna todas as colunas originais
    } catch (err) {
        console.error('Erro ao buscar serviços:', err);
        res.status(500).json({ success: false, message: 'Erro no servidor' });
    }
};