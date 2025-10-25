import express, { Request, Response } from 'express';
import prisma from '../db.js';

const router = express.Router();

// Get all visit types
router.get('/', async (req: Request, res: Response) => {
  try {
    const visitTypes = await prisma.visitType.findMany();
    res.json(visitTypes);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Get visit type by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const visitType = await prisma.visitType.findUnique({
      where: { id },
    });

    if (!visitType) {
      return res.status(404).json({ error: 'Visit type not found' });
    }

    res.json(visitType);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

export default router;
