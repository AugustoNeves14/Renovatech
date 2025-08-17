const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ==========================================================================
// FUNÇÃO DE CADASTRO (REGISTER)
// ==========================================================================
exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    // --- 1. Validação Robusta dos Dados de Entrada ---
    if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: 'Por favor, preencha todos os campos obrigatórios.' });
    }
    if (password.length < 8) {
        return res.status(400).json({ success: false, message: 'A senha deve ter no mínimo 8 caracteres.' });
    }
    // Regex para validar formato de email
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ success: false, message: 'Por favor, insira um email com formato válido.' });
    }
    
    try {
        // --- 2. Verificar se o email já está em uso (Erro 409 Conflict) ---
        const userExists = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
        if (userExists.rows.length > 0) {
            return res.status(409).json({ success: false, message: 'Este endereço de email já está registado.' });
        }
        
        // --- 3. Criptografar a senha com bcrypt ---
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // --- 4. Inserir o novo utilizador na base de dados ---
        // A query está correta e não tenta inserir a 'role', pois o banco de dados
        // irá atribuir o valor padrão 'user' automaticamente.
        const newUserQuery = `
            INSERT INTO users (username, email, password) 
            VALUES ($1, $2, $3) 
            RETURNING id, username, email, role, created_at
        `;
        const newUserResult = await pool.query(newUserQuery, [username, email, hashedPassword]);

        // --- 5. Enviar resposta de sucesso ---
        res.status(201).json({ 
            success: true, 
            message: 'Conta criada com sucesso!', 
            user: newUserResult.rows[0] 
        });

    } catch (err) {
        // Captura qualquer outro erro (ex: falha de conexão com o DB) e retorna um erro 500
        console.error('>> ERRO FATAL NO REGISTO:', err.stack);
        res.status(500).json({ success: false, message: 'Ocorreu um erro inesperado no servidor. Por favor, tente novamente.' });
    }
};

// ==========================================================================
// FUNÇÃO DE LOGIN
// ==========================================================================
exports.login = async (req, res) => {
    const { email, password } = req.body;

    // --- 1. Validação dos Dados de Entrada ---
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Por favor, preencha o email e a senha.' });
    }

    try {
        // --- 2. Verificar se o utilizador existe ---
        const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userResult.rows.length === 0) {
            // Mensagem de erro genérica para não revelar se o email existe ou não (segurança)
            return res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
        }
        
        const user = userResult.rows[0];

        // --- 3. Comparar a senha fornecida com a senha criptografada no DB ---
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
        }

        // --- 4. Criar o Payload (dados a serem guardados no token) ---
        const payload = {
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        };

        // --- 5. Assinar e retornar o Token JWT ---
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1d' }, // O token expira em 1 dia
            (err, token) => {
                if (err) throw err; // Se houver erro na assinatura do token, lança exceção
                
                res.status(200).json({
                    success: true,
                    message: 'Login bem-sucedido!',
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        role: user.role
                    }
                });
            }
        );

    } catch (err) {
        console.error('>> ERRO FATAL NO LOGIN:', err.stack);
        res.status(500).json({ success: false, message: 'Ocorreu um erro inesperado no servidor. Por favor, tente novamente.' });
    }
};