import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://musmoodrzscfeodpxvyg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11c21vb2RyenNjZmVvZHB4dnlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDE0NTE5MCwiZXhwIjoyMDc5NzIxMTkwfQ.rn3dZrOR5VMQS4mX1opqqSt7LhXJgKgYenkwHekGkck';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTable() {
  const sql = `
    create table if not exists pages (
      id bigint generated always as identity primary key,
      recipient_name text,
      title text,
      message text,
      photos text[],
      music text,
      created_at timestamptz default now()
    );
  `;
  // Supabase não tem método direto para executar SQL arbitrário via JS,
  // normalmente isso é feito pelo painel ou via função RPC customizada.
  // Aqui está um exemplo de chamada RPC (você precisa criar a função 'execute_sql' no Supabase):
  const { error } = await supabase.rpc('execute_sql', { sql });
  if (error) {
    console.error('Erro ao criar tabela:', error.message);
  } else {
    console.log('Tabela criada com sucesso!');
  }
}

createTable();
