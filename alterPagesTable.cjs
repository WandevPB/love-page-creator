// Cria os campos extras na tabela 'pages' do Supabase
// Necessário: npm install pg

const { Client } = require('pg');
const connectionString = 'postgresql://postgres:postgres@db.musmoodrzscfeodpxvyg.supabase.co:5432/postgres';

const client = new Client({ connectionString });

async function alterTable() {
  try {
    await client.connect();
    await client.query(`
      ALTER TABLE public.pages
        ADD COLUMN IF NOT EXISTS recipient_name text,
        ADD COLUMN IF NOT EXISTS message text,
        ADD COLUMN IF NOT EXISTS photos text[],
        ADD COLUMN IF NOT EXISTS music text;
    `);
    console.log('Campos extras adicionados na tabela pages!');
  } catch (error) {
    console.error('Erro ao alterar tabela:', error.message);
  } finally {
    await client.end();
  }
}

alterTable();
