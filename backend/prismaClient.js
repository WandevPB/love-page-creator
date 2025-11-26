// backend/prismaClient.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = prisma;

// Exemplo de uso:
// const page = await prisma.page.create({ data: { title: 'Título', content: 'Conteúdo', photos: ['url1'], music: 'url2' } });
