// renovatech-backend/controllers/profileController.js

const pool = require('../config/db');
const bcrypt = require('bcryptjs');

/**
 * @desc    Obter os dados do perfil do utilizador atualmente logado
 * @route   GET /api/profile
 * @access  Privado (requer token)
 */
exports.getUserProfile = async (req, res) => {
    try {
        // O ID do utilizador é adicionado ao 'req.user' pelo nosso middleware 'protect'
        const userId = req.user.id;

        const userProfile = await pool.query(
            "SELECT id, username, email, role, created_at FROM users WHERE id = $1",
            [userId]
        );

        if (userProfile.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Utilizador não encontrado.' });
        }

        res.status(200).json({ success: true, profile: userProfile.rows[0] });

    } catch (error) {
        console.error('>> ERRO AO BUSCAR PERFIL:', error.stack);
        res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
};

/**
 * @desc    Atualizar os dados do perfil do utilizador atualmente logado
 * @route   PUT /api/profile
 * @access  Privado (requer token)
 */
exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { username, email, phone, newPassword } = req.body;

        // Validação básica dos campos obrigatórios
        if (!username || !email) {
            return res.status(400).json({ success: false, message: 'Nome de utilizador e email são obrigatórios.' });
        }

        // --- Constrói a query de atualização dinamicamente ---
        const fieldsToUpdate = [];
        const values = [];
        let queryIndex = 1;

        if (username) {
            fieldsToUpdate.push(`username = $${queryIndex++}`);
            values.push(username);
        }
        if (email) {
            fieldsToUpdate.push(`email = $${queryIndex++}`);
            values.push(email);
        }
        
        // Se uma nova senha for fornecida, criptografa-a
        if (newPassword) {
            if (newPassword.length < 8) {
                 return res.status(400).json({ success: false, message: 'A nova senha deve ter no mínimo 8 caracteres.' });
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            fieldsToUpdate.push(`password = $${queryIndex++}`);
            values.push(hashedPassword);
        }

        // Adiciona o ID do utilizador como o último valor para a cláusula WHERE
        values.push(userId);

        if (fieldsToUpdate.length === 0) {
            return res.status(400).json({ success: false, message: 'Nenhum dado para atualizar foi fornecido.' });
        }

        const updateQuery = `
            UPDATE users SET ${fieldsToUpdate.join(', ')} 
            WHERE id = $${queryIndex}
            RETURNING id, username, email, role
        `;

        const updatedUser = await pool.query(updateQuery, values);
        
        res.status(200).json({
            success: true,
            message: 'Perfil atualizado com sucesso!',
            user: updatedUser.rows[0]
        });

    } catch (error) {
        console.error('>> ERRO AO ATUALIZAR PERFIL:', error.stack);
        // Trata erro de email/username duplicado
        if (error.code === '23505') { // Código de erro do PostgreSQL para violação de unicidade
            return res.status(409).json({ success: false, message: 'O email ou nome de utilizador já está em uso por outra conta.' });
        }
        res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
};