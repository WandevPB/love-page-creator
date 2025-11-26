// Corrige os buckets 'photos' e 'music' para serem públicos no Supabase Storage
// Necessário: npm install node-fetch

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const supabaseUrl = 'https://musmoodrzscfeodpxvyg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11c21vb2RyenNjZmVvZHB4dnlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDE0NTE5MCwiZXhwIjoyMDc5NzIxMTkwfQ.rn3dZrOR5VMQS4mX1opqqSt7LhXJgKgYenkwHekGkck';

async function setBucketPublic(bucket) {
  const res = await fetch(`${supabaseUrl}/storage/v1/bucket/${bucket}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'apikey': supabaseServiceKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      public: true
    })
  });
  const data = await res.json();
  if (res.ok) {
    console.log(`Bucket '${bucket}' agora está público!`);
  } else {
    console.error(`Erro ao atualizar bucket '${bucket}':`, data.message || data.error);
  }
}

(async () => {
  await setBucketPublic('photos');
  await setBucketPublic('music');
})();
