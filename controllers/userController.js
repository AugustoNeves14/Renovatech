// renovatech-backend/controllers/userController.js
const pool = require('../config/db');

// Obter todos os utilizadores (apenas para admin)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await pool.query("SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC");
        res.status(200).json({ success: true, users: users.rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro de servidor.' });
    }
};

// Atualizar a role de um utilizador (apenas para admin)
exports.updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    if (role !== 'user' && role !== 'admin') {
        return res.status(400).json({ success: false, message: 'Role inválida.' });
    }
    try {
        const updatedUser = await pool.query(
            "UPDATE users SET role = $1 WHERE id = $2 RETURNING id, username, email, role",
            [role, id]
        );
        if (updatedUser.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Utilizador não encontrado.' });
        }
        res.status(200).json({ success: true, message: 'Cargo atualizado com sucesso!', user: updatedUser.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro de servidor.' });
    }
};
// Adicione aqui funções para apagar, ver perfil, etc.