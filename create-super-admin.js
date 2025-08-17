// renovatech-backend/create-super-admin.js

require('dotenv').config(); // Carrega as variáveis de ambiente do .env para a conexão com o DB
const pool = require('./config/db');
const bcrypt = require('bcryptjs');

// --- DADOS DO SUPER ADMINISTRADOR ---
const SUPER_ADMIN_EMAIL = 'renovatech@renovaluz.ao';
const SUPER_ADMIN_USERNAME = 'RenovatechAdmin'; // Um nome de utilizador padrão
const SUPER_ADMIN_PASSWORD = '@renovaluz.ao';

const setupSuperAdmin = async () => {
    console.log('--- Iniciando script de configuração do Super Admin ---');

    try {
        // 1. Criptografar a senha
        console.log('Criptografando a senha...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(SUPER_ADMIN_PASSWORD, salt);
        console.log('Senha criptografada com sucesso.');

        // 2. Verificar se o utilizador já existe pelo email
        console.log(`Verificando se o utilizador com o email "${SUPER_ADMIN_EMAIL}" já existe...`);
        const userExists = await pool.query("SELECT id FROM users WHERE email = $1", [SUPER_ADMIN_EMAIL]);

        if (userExists.rows.length > 0) {
            // Se o utilizador existe, atualiza a senha e garante que a role é 'admin'
            const existingUserId = userExists.rows[0].id;
            console.log(`Utilizador encontrado (ID: ${existingUserId}). Atualizando para garantir que é Super Admin...`);

            await pool.query(
                "UPDATE users SET password = $1, role = 'admin', username = $2 WHERE id = $3",
                [hashedPassword, SUPER_ADMIN_USERNAME, existingUserId]
            );
            
            console.log(`\n✅ SUCESSO! O utilizador "${SUPER_ADMIN_EMAIL}" foi atualizado para Super Admin.`);
            console.log('   A senha foi redefinida para a padrão do script.');

        } else {
            // Se o utilizador não existe, cria um novo
            console.log('Utilizador não encontrado. Criando um novo Super Admin...');
            
            await pool.query(
                "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, 'admin')",
                [SUPER_ADMIN_USERNAME, SUPER_ADMIN_EMAIL, hashedPassword]
            );

            console.log(`\n✅ SUCESSO! O Super Admin foi criado com as seguintes credenciais:`);
        }

        console.log('----------------------------------------------------');
        console.log(`   Email: ${SUPER_ADMIN_EMAIL}`);
        console.log(`   Senha: ${SUPER_ADMIN_PASSWORD}`);
        console.log('----------------------------------------------------');

    } catch (error) {
        console.error('\n❌ ERRO: Ocorreu um problema ao executar o script.');
        console.error('   Mensagem do erro:', error.message);
    } finally {
        // Encerra a conexão com o banco de dados para que o script termine
        console.log('\n--- Script finalizado. Encerrando conexão com o banco de dados. ---');
        //pool.end();
    }
};

// Executa a função
setupSuperAdmin();