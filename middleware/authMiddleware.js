// renovatech-backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token;
    // Verifica se o header de autorização existe e começa com "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extrai o token do header (formato: "Bearer TOKEN_AQUI")
            token = req.headers.authorization.split(' ')[1];

            // Verifica e decodifica o token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Anexa os dados do utilizador ao objeto da requisição
            req.user = decoded.user;
            next();
        } catch (error) {
            console.error('Token inválido:', error.message);
            res.status(401).json({ success: false, message: 'Não autorizado, token inválido.' });
        }
    }

    if (!token) {
        res.status(401).json({ success: false, message: 'Não autorizado, token não encontrado.' });
    }
};

const isAdmin = (req, res, next) => {
    // Esta função deve ser usada DEPOIS do middleware 'protect'
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Acesso negado. Requer privilégios de administrador.' }); // 403 Forbidden
    }
};

module.exports = { protect, isAdmin };