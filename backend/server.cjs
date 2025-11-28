require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');

// Removido Prisma, usaremos arquivo JSON local
const crypto = require('crypto');

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


app.post('/api/pages', upload.fields([{ name: 'photos' }, { name: 'music', maxCount: 1 }]), (req, res) => {
  try {
    let title = '';
    let message = '';
    let recipientName = '';
    if (req.body) {
      if (typeof req.body.title === 'string') title = req.body.title;
      if (typeof req.body.message === 'string') message = req.body.message;
      if (typeof req.body.recipientName === 'string') recipientName = req.body.recipientName;
    }
    // Se não houver dados mínimos, retorna erro
    if (!title && !message && !recipientName && (!req.files || !req.files['photos'])) {
      return res.status(400).json({ error: 'Dados insuficientes para criar página.' });
    }
    const photoFiles = Array.isArray(req.files && req.files['photos']) ? req.files['photos'] : [];
    const musicFile = req.files && req.files['music'] ? req.files['music'][0] : null;
    // Garante que os links sejam sempre https
    const host = req.get('host').replace(/^http:/, 'https:');
    const photoUrls = photoFiles.map(file => `https://${host}/uploads/photos/${file.filename}`);
    let musicUrl = null;
    if (musicFile) {
      musicUrl = `https://${host}/uploads/music/${musicFile.filename}`;
    }
    // Carregar páginas existentes
    const pagesPath = path.join(__dirname, 'uploads', 'pages.json');
    let pages = [];
    if (fs.existsSync(pagesPath)) {
      try {
        pages = JSON.parse(fs.readFileSync(pagesPath, 'utf8'));
      } catch (e) { pages = []; }
    }
    // Gerar id aleatório
    const newId = crypto.randomBytes(8).toString('hex');
    const createdAt = new Date().toISOString();
    const page = {
      id: newId,
      recipientName,
      title,
      message,
      photos: photoUrls,
      music: musicUrl,
      createdAt,
      link: `/view/${newId}`
    };
    pages.push(page);
    fs.writeFileSync(pagesPath, JSON.stringify(pages, null, 2));
    res.json(page);
  } catch (err) {
    console.error('Erro ao criar página:', err);
    res.status(500).json({ error: err.message });
  }
});


// Rota para listar todas as páginas para o admin
app.get('/api/admin/pages', (req, res) => {
  try {
    const pagesPath = path.join(__dirname, 'uploads', 'pages.json');
    let pages = [];
    if (fs.existsSync(pagesPath)) {
      try {
        pages = JSON.parse(fs.readFileSync(pagesPath, 'utf8'));
      } catch (e) { pages = []; }
    }
    res.json(pages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get('/api/pages/:id', (req, res) => {
  try {
    const pagesPath = path.join(__dirname, 'uploads', 'pages.json');
    let pages = [];
    if (fs.existsSync(pagesPath)) {
      pages = JSON.parse(fs.readFileSync(pagesPath, 'utf8'));
    }
    const page = pages.find(p => p.id == req.params.id);
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
