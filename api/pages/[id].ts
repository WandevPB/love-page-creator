import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '../../backend/prismaClient.js';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const id = Number(req.query.id);
      const page = await prisma.page.findUnique({ where: { id } });
      if (!page) return res.status(404).json({ error: 'Página não encontrada' });
      res.status(200).json(page);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
