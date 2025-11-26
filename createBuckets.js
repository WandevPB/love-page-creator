// createBuckets.js
// Cria buckets 'photos' e 'music' no Supabase Storage via API REST
// Necessário: npm install node-fetch

const fetch = require('node-fetch');

const supabaseUrl = 'https://musmoodrzscfeodpxvyg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11c21vb2RyenNjZmVvZHB4dnlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDE0NTE5MCwiZXhwIjoyMDc5NzIxMTkwfQ.rn3dZrOR5VMQS4mX1opqqSt7LhXJgKgYenkwHekGkck';

async function createBucket(bucket) {
  const res = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'apikey': supabaseServiceKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: bucket,
      public: true
    })
  });
  const data = await res.json();
  if (res.ok) {
    console.log(`Bucket '${bucket}' criado!`);
  } else {
    console.error(`Erro ao criar bucket '${bucket}':`, data.message || data.error);
  }
}

(async () => {
  await createBucket('photos');
  await createBucket('music');
})();
