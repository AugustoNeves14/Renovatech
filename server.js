require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Importação das rotas
const authRoutes = require('./routes/auth');
const servicesRoutes = require('./routes/services');
const slidesRoutes = require('./routes/slides');
const userRoutes = require('./routes/userRoutes'); // NOVO IMPORT
const newsRoutes = require('./routes/newsRoutes');       // ESTA LINHA PROVAVELMENTE FALTA
const galleryRoutes = require('./routes/galleryRoutes'); // ESTA LINHA PROVAVELMENTE FALTA
const profileRoutes = require('./routes/profileRoutes'); // <<--- ESTA LINHA ESTAVA EM FALTA

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middlewares ---

// 1. Habilita o CORS para permitir requisições de qualquer origem (essencial para o Live Server)
app.use(cors());

// 2. Habilita o parsing de JSON no corpo das requisições
app.use(express.json());

// 3. **[NOVO] Middleware de Log de Requisições**
//    Este trecho vai imprimir no console cada requisição que o backend receber.
//    Isso é crucial para sabermos se o frontend está se comunicando.
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] Recebida requisição: ${req.method} ${req.originalUrl}`);
    next(); // Passa a requisição para a próxima etapa (as rotas)
});

// Rotas Protegidas (Admin) - NOVO
app.use('/api/profile', profileRoutes); // <<--- NOVA ROTA PARA O PERFIL DO UTILIZADOR
app.use('/api/users', userRoutes);      // <<--- ROTA PARA GESTÃO DE UTILIZADORES PELO ADMIN

app.use('/api/slides', slidesRoutes); // A rota pública GET continua a funcionar
// --- Rotas da API ---
app.get('/', (req, res) => {
    res.send('API da Renovatech está funcionando!');
});

app.use('/api/auth', authRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/slides', slidesRoutes);
app.use('/api/news', newsRoutes);         // ESTA LINHA PROVAVELMENTE FALTA
app.use('/api/gallery', galleryRoutes);   // ESTA LINHA PROVAVELMENTE FALTA

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
  console.log('📡 Aguardando requisições do frontend...');
});