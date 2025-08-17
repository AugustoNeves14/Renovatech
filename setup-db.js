// renovatech-backend/setup-db.js (VERSÃO MESTRE E FINAL)

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// --- CONFIGURAÇÃO ---

// 1. Configurações da aplicação (lidas do arquivo .env)
const appDbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
};

// 2. Configurações do SUPERUSUÁRIO do PostgreSQL
//    !! IMPORTANTE !! Edite esta seção com suas credenciais de administrador do PostgreSQL.
const superuserConfig = {
  user: 'postgres',                      // <-- CONFIRME SE ESTE É SEU SUPERUSUÁRIO
  password: 'sua_senha_de_superusuario_aqui', // <-- COLOQUE SUA SENHA REAL AQUI
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: 'postgres' // Conecta-se ao banco 'postgres' padrão para tarefas administrativas
};

// 3. Dados do Super Administrador a ser criado DENTRO da aplicação
const SUPER_ADMIN_EMAIL = 'renovatech@renovaluz.ao';
const SUPER_ADMIN_USERNAME = 'RenovatechAdmin';
const SUPER_ADMIN_PASSWORD = '@renovaluz.ao@2023'; // Senha forte para o Super Admin


// --- EXECUÇÃO DO SCRIPT ---

const setupDatabase = async () => {
  const superuserClient = new Client(superuserConfig);

  try {
    // ========================================================================
    // ETAPA 1: CONECTAR COMO SUPERUSUÁRIO E RECONSTRUIR A BASE DE DADOS
    // ========================================================================
    console.log('--- ETAPA 1: Conectando como Superusuário para preparar o ambiente...');
    await superuserClient.connect();
    console.log('✅ Conectado ao PostgreSQL como superusuário.');

    // 1.1: APAGAR a base de dados antiga, se existir
    console.log(`   - Verificando se a base de dados "${appDbConfig.database}" existe...`);
    const dbExists = await superuserClient.query(`SELECT 1 FROM pg_database WHERE datname = '${appDbConfig.database}'`);
    if (dbExists.rowCount > 0) {
      console.log(`   - Base de dados encontrada. A APAGAR... (Isto irá remover todos os dados antigos)`);
      // É preciso terminar as conexões ativas antes de apagar
      await superuserClient.query(`SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '${appDbConfig.database}' AND pid <> pg_backend_pid();`);
      await superuserClient.query(`DROP DATABASE "${appDbConfig.database}"`);
      console.log(`   - Base de dados "${appDbConfig.database}" apagada com sucesso.`);
    } else {
      console.log(`   - Base de dados não encontrada. A avançar para a criação.`);
    }

    // 1.2: APAGAR o utilizador antigo, se existir (para garantir uma configuração limpa)
    console.log(`   - Verificando se o utilizador "${appDbConfig.user}" existe...`);
    const userExists = await superuserClient.query("SELECT 1 FROM pg_roles WHERE rolname = $1", [appDbConfig.user]);
    if (userExists.rowCount > 0) {
        console.log(`   - Utilizador encontrado. A APAGAR...`);
        await superuserClient.query(`DROP ROLE "${appDbConfig.user}"`);
        console.log(`   - Utilizador "${appDbConfig.user}" apagado com sucesso.`);
    }

    // 1.3: CRIAR o novo utilizador e a nova base de dados
    console.log(`   - Criando novo utilizador "${appDbConfig.user}"...`);
    await superuserClient.query(`CREATE USER "${appDbConfig.user}" WITH LOGIN PASSWORD '${appDbConfig.password}'`);
    console.log(`   - Utilizador criado.`);
    
    console.log(`   - Criando nova base de dados "${appDbConfig.database}"...`);
    await superuserClient.query(`CREATE DATABASE "${appDbConfig.database}" OWNER "${appDbConfig.user}"`);
    console.log(`   - Base de dados criada e atribuída a "${appDbConfig.user}".`);

  } catch (error) {
    console.error('\n❌ ERRO FATAL NA ETAPA 1 (Superusuário):');
    console.error('   ' + error.message);
    if (error.message.includes('password authentication failed')) {
      console.error('\n--> DICA: A senha do seu superusuário em "superuserConfig" está incorreta. Verifique a senha dentro deste script.');
    }
    return; // Interrompe a execução se a parte 1 falhar
  } finally {
    await superuserClient.end();
    console.log('🔌 Conexão de superusuário encerrada.');
  }

  // ========================================================================
  // ETAPA 2: CONECTAR À NOVA BASE DE DADOS E POPULAR COM DADOS
  // ========================================================================
  const appClient = new Client(appDbConfig);
  try {
    console.log('\n--- ETAPA 2: Populando a nova base de dados da aplicação ---');
    await appClient.connect();
    console.log(`✅ Conectado ao banco "${appDbConfig.database}" como utilizador da aplicação.`);

    // 2.1: Ler e executar o schema.sql para criar as tabelas
    console.log('   - Lendo schema.sql...');
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
    console.log('   - Executando schema.sql para criar as tabelas...');
    await appClient.query(schemaSql);
    console.log('   - Tabelas criadas com sucesso.');

    // 2.2: Ler e executar o seed.sql para dados iniciais (se existir)
    const seedPath = path.join(__dirname, 'database', 'seed.sql');
    if (fs.existsSync(seedPath)) {
        console.log('   - Lendo seed.sql...');
        const seedSql = fs.readFileSync(seedPath, 'utf-8');
        console.log('   - Inserindo dados iniciais (seeding)...');
        await appClient.query(seedSql);
        console.log('   - Dados iniciais inseridos com sucesso.');
    }

    // 2.3: Inserir/Atualizar o SUPER ADMIN da aplicação
    console.log('   - A configurar o Super Admin da aplicação...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(SUPER_ADMIN_PASSWORD, salt);
    
    // Como a base de dados é sempre nova, usamos sempre INSERT
    await appClient.query(
        "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, 'admin')",
        [SUPER_ADMIN_USERNAME, SUPER_ADMIN_EMAIL, hashedPassword]
    );
    console.log(`   - Super Admin "${SUPER_ADMIN_EMAIL}" criado com sucesso.`);
    
    console.log('\n✅🎉 TUDO PRONTO! O ambiente de desenvolvimento foi completamente reconstruído.');
    console.log('----------------------------------------------------');
    console.log('   Credenciais do Super Admin da Aplicação:');
    console.log(`   Email: ${SUPER_ADMIN_EMAIL}`);
    console.log(`   Senha: ${SUPER_ADMIN_PASSWORD}`);
    console.log('----------------------------------------------------');

  } catch (error) {
    console.error('\n❌ ERRO FATAL NA ETAPA 2 (Populando a Base de Dados):');
    console.error('   ' + error.message);
    console.error('\n--> DICA: Verifique se os seus ficheiros schema.sql e seed.sql não contêm erros de sintaxe SQL.');
  } finally {
    await appClient.end();
    console.log('🔌 Conexão da aplicação encerrada.');
  }
};

setupDatabase();