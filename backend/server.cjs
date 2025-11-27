require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const path = require('path');
const fs = require('fs');
const app = express();
app.use(cors());
app.use(express.json());

// Configura Multer para salvar arquivos localmente
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = 'photos';
    if (file.fieldname === 'music') folder = 'music';
    const uploadPath = path.join(__dirname, 'uploads', folder);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});
const upload = multer({ storage });

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.post('/api/pages', upload.fields([{ name: 'photos' }, { name: 'music', maxCount: 1 }]), async (req, res) => {
  try {
    // Extração robusta dos campos
    let title = '';
    let message = '';
    let recipientName = '';
    if (req.body) {
      if (typeof req.body.title === 'string') title = req.body.title;
      if (typeof req.body.message === 'string') message = req.body.message;
      if (typeof req.body.recipientName === 'string') recipientName = req.body.recipientName;
    }
    const photoFiles = Array.isArray(req.files && req.files['photos']) ? req.files['photos'] : [];
    const musicFile = req.files && req.files['music'] ? req.files['music'][0] : null;
    const photoUrls = photoFiles.map(file => `${req.protocol}://${req.get('host')}/uploads/photos/${file.filename}`);
    let musicUrl = null;
    if (musicFile) {
      musicUrl = `${req.protocol}://${req.get('host')}/uploads/music/${musicFile.filename}`;
    }
    // Log após definição das variáveis
    console.log('req.files:', req.files);
    console.log('req.body:', req.body);
    console.log('Dados enviados ao Prisma:', {
      recipientName: recipientName || '',
      title: title || '',
      content: message || '',
      photos: photoUrls,
      music: musicUrl || null,
    });
    // Salvar photos como string JSON
    const page = await prisma.page.create({
      data: {
        title: title || '',
        content: message || '',
        photos: JSON.stringify(photoUrls),
        music: musicUrl || null,
      },
    });
    // Retornar recipientName junto com os dados, photos como array
    res.json({ id: page.id, recipientName, title: page.title, message: page.content, photos: JSON.parse(page.photos || '[]'), music: page.music, createdAt: page.createdAt });
  } catch (err) {
    console.error('Erro ao criar página:', err);
    res.status(500).json({ error: err.message });
  }
});


app.get('/api/pages', async (req, res) => {
  try {
    const pages = await prisma.page.findMany();
    // Adiciona recipientName vazio para compatibilidade, photos como array
    const result = pages.map(page => ({
      id: page.id,
      recipientName: '',
      title: page.title,
      message: page.content,
      photos: JSON.parse(page.photos || '[]'),
      music: page.music,
      createdAt: page.createdAt
    }));
    res.json(result);
  } catch (err) {
    console.error('Erro ao listar páginas:', err);
    res.status(500).json({ error: err.message });
  }
});


app.get('/api/pages/:id', async (req, res) => {
  try {
    const page = await prisma.page.findUnique({
      where: { id: req.params.id },
    });
    if (!page) return res.status(404).json({ error: 'Página não encontrada' });
    // Adiciona recipientName vazio para compatibilidade, photos como array
    res.json({
      id: page.id,
      recipientName: '',
      title: page.title,
      message: page.content,
      photos: JSON.parse(page.photos || '[]'),
      music: page.music,
      createdAt: page.createdAt
    });
  } catch (err) {
    console.error('Erro ao buscar página:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
