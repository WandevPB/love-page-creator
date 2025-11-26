
// Cria a tabela 'pages' no Supabase via PostgreSQL
// Necessário: npm install pg

const { Client } = require('pg');

const connectionString = 'COLE_AQUI_SUA_CONNECTION_STRING_DO_SUPABASE'; // Altere para sua string

const client = new Client({
  connectionString,
});

async function createTable() {
  try {
    await client.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.pages (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        title text,
        content text,
        created_at timestamp with time zone DEFAULT now()
      );
    `);
    console.log('Tabela criada com sucesso!');
  } catch (error) {
    console.error('Erro ao criar tabela:', error.message);
  } finally {
    await client.end();
  }
}

createTable();
