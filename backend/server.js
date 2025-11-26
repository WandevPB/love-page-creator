// Endpoint para fornecer upload URL/token do B2 ao frontend
app.get('/api/b2-upload-url', async (req, res) => {
  try {
    await b2.authorize();
    const bucketId = process.env.B2_BUCKET_ID;
    const uploadUrlResp = await b2.getUploadUrl({ bucketId });
    res.json({
      uploadUrl: uploadUrlResp.data.uploadUrl,
      authorizationToken: uploadUrlResp.data.authorizationToken,
      bucketName: process.env.B2_BUCKET_NAME,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { PrismaClient } = require('@prisma/client');
const B2 = require('backblaze-b2');
const app = express();
app.use(cors());
app.use(express.json());

const b2 = new B2({
  applicationKeyId: process.env.B2_KEY_ID,
  applicationKey: process.env.B2_KEY_NAME,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper para upload no B2
async function uploadToB2(file, folder = 'photos') {
  await b2.authorize();
  const bucketId = process.env.B2_BUCKET_ID;
  const fileName = `${folder}/${Date.now()}_${file.originalname}`;
  const uploadUrlResp = await b2.getUploadUrl({ bucketId });
  const uploadResp = await b2.uploadFile({
    uploadUrl: uploadUrlResp.data.uploadUrl,
    uploadAuthToken: uploadUrlResp.data.authorizationToken,
    filename: fileName,
    data: file.buffer,
    contentType: file.mimetype,
  });
  // URL pública padrão do B2
  return `https://f000.backblazeb2.com/file/${process.env.B2_BUCKET_NAME}/${fileName}`;
}

app.post('/api/pages', upload.fields([{ name: 'photos' }, { name: 'music', maxCount: 1 }]), async (req, res) => {
  try {
    const { recipientName, title, message } = req.body;
    const photoFiles = req.files['photos'] || [];
    const musicFile = req.files['music'] ? req.files['music'][0] : null;

    // Upload das fotos para B2
    const photoUrls = await Promise.all(photoFiles.map(file => uploadToB2(file, 'photos')));

    // Upload da música para B2
    let musicUrl = null;
    if (musicFile) {
      musicUrl = await uploadToB2(musicFile, 'music');
    }

    // Persistir página no banco
    const page = await prisma.page.create({
      data: {
        recipient_name: recipientName,
        title,
        message,
        photos: photoUrls,
        music: musicUrl,
      },
    });
    res.json({ id: page.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/pages - lista todas as páginas
app.get('/api/pages', async (req, res) => {
  try {
    const pages = await prisma.page.findMany();
    res.json(pages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/pages/:id - busca página por id
app.get('/api/pages/:id', async (req, res) => {
  try {
    const page = await prisma.page.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!page) return res.status(404).json({ error: 'Página não encontrada' });
    res.json(page);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
// (REMOVIDO: imports e redeclaração de storage/upload duplicados)

// POST /api/pages - cria uma nova página
app.post('/api/pages', upload.any(), async (req, res) => {
  try {
    const { recipientName, title, message } = req.body;
    const photos = req.files.filter(f => f.fieldname === 'photos').map(file => {
      // Simulação: salva como base64 (ideal: salvar em storage/cloud)
      return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    });
    let music = null;
    const musicFile = req.files.find(f => f.fieldname === 'music');
    if (musicFile) {
      music = `data:${musicFile.mimetype};base64,${musicFile.buffer.toString('base64')}`;
    }
    // Aqui você pode persistir no banco, etc.
    res.json({ recipientName, title, message, photos, music });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// (REMOVIDO: bloco duplicado de rotas e listen)
