require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { PrismaClient } = require('@prisma/client');

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
    const { recipientName, title, message } = req.body;
    const photoFiles = req.files['photos'] || [];
    const musicFile = req.files['music'] ? req.files['music'][0] : null;
        // URLs locais para os arquivos
        const photoUrls = photoFiles.map(file => `${req.protocol}://${req.get('host')}/uploads/photos/${file.filename}`);
        let musicUrl = null;
        if (musicFile) {
          musicUrl = `${req.protocol}://${req.get('host')}/uploads/music/${musicFile.filename}`;
        }
    const prisma = new PrismaClient();
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

app.get('/api/pages', async (req, res) => {
  try {
    const prisma = new PrismaClient();
    const pages = await prisma.page.findMany();
    res.json(pages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/pages/:id', async (req, res) => {
  try {
    const prisma = new PrismaClient();
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
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
