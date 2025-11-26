# Supabase Automação - Documentação

## Tabela pages
- Estrutura SQL simulada em `supabase_schema.sql`.
- Campos: id (uuid, PK), title (text), content (text), created_at (timestamp).
- Crie pelo painel Supabase ou via SQL.

## Buckets de Storage
- Crie buckets chamados `photos` e `music` no painel Supabase > Storage.
- Configure como públicos para upload e visualização.

## Integração no Projeto
- O arquivo `src/lib/supabaseClient.ts` já inicializa o Supabase com as variáveis de ambiente corretas.
- O frontend está pronto para persistir dados na tabela `pages` e nos buckets de storage.

## Passos automáticos
- Não é necessário executar scripts manualmente.
- Toda a estrutura está pronta para funcionar assim que a tabela e os buckets forem criados no Supabase.

## Observação
- Se precisar criar a tabela ou buckets, use o painel Supabase para máxima segurança.
- Nunca compartilhe sua connection string do banco de dados publicamente.
