const { PrismaClient } = require('@prisma/client');
const formidable = require('formidable');
const { readFileSync, existsSync } = require('fs');

async function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

module.exports = async (req, res) => {
  const prisma = new PrismaClient();
  if (req.method === 'POST') {
    try {
      const { fields, files } = await parseForm(req);
      const photos = Array.isArray(files.photos)
        ? files.photos.map(file =>
            existsSync(file.filepath)
              ? `data:${file.mimetype};base64,${readFileSync(file.filepath).toString('base64')}`
              : null
          ).filter(Boolean)
        : files.photos && existsSync(files.photos.filepath)
          ? [`data:${files.photos.mimetype};base64,${readFileSync(files.photos.filepath).toString('base64')}`]
          : [];
      let music = null;
      if (files.music && existsSync(files.music.filepath)) {
        music = `data:${files.music.mimetype};base64,${readFileSync(files.music.filepath).toString('base64')}`;
      }
      const page = await prisma.page.create({
        data: {
          recipient_name: fields.recipientName,
          title: fields.title,
          message: fields.message,
          photos,
          music,
        },
      });
      res.status(200).json({ id: page.id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'GET') {
    try {
      const pages = await prisma.page.findMany();
      res.status(200).json(pages);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};
