// renovatech-backend/config/db.js (VERSÃO FINAL E CORRIGIDA)

const { Pool } = require('pg');
require('dotenv').config();

/**
 * Cria uma instância do Pool de Conexões do PostgreSQL.
 * O Pool gere múltiplas conexões de clientes automaticamente,
 * o que é mais eficiente e robusto para uma aplicação web.
 */
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

/**
 * Teste de Conexão Opcional.
 * Esta função anónima é auto-executada para testar a conexão
 * assim que o servidor arranca.
 */
(async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Conexão com o banco de dados PostgreSQL estabelecida com sucesso!');
    client.release(); // Liberta o cliente de volta para o pool
  } catch (err) {
    console.error('❌ ERRO FATAL: Não foi possível conectar ao banco de dados PostgreSQL.');
    console.error('   Por favor, verifique as suas credenciais no arquivo .env');
    console.error('   Detalhes do erro:', err.message);
  }
})();

/**
 * Exportamos o objeto 'pool' diretamente.
 * Os nossos controladores irão chamar pool.query() para executar comandos SQL.
 * Esta é a abordagem padrão e mais limpa.
 */
module.exports = pool;