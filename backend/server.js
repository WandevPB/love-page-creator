import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { PrismaClient } from './prismaClient.js';
const prisma = new PrismaClient();

const app = express();
app.use(cors());
app.use(express.json());

// Configuração do Multer para upload de arquivos
const storage = multer.memoryStorage();
const upload = multer({ storage });

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
    const page = await prisma.page.create({
      data: {
        recipient_name: recipientName,
        title,
        message,
        photos,
        music,
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
