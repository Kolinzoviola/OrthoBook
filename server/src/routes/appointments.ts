import express, { Request, Response } from 'express';
import prisma from '../db.js';
import {
  CreateAppointmentSchema,
  UpdateAppointmentSchema,
  GetAppointmentsQuerySchema,
} from '../validation.js';

const router = express.Router();

// Get all appointments with optional filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const query = GetAppointmentsQuerySchema.parse(req.query);

    const where: any = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.email) {
      where.email = query.email;
    }

    if (query.date) {
      where.date = query.date;
    }

    if (query.startDate && query.endDate) {
      where.date = {
        gte: query.startDate,
        lte: query.endDate,
      };
    }

    const appointments = await prisma.appointment.findMany({
      where,
      orderBy: [
        { date: 'asc' },
        { time: 'asc' },
      ],
    });

    // Parse files JSON string back to array
    const appointmentsWithParsedFiles = appointments.map(apt => ({
      ...apt,
      files: apt.files ? JSON.parse(apt.files) : [],
    }));

    res.json(appointmentsWithParsedFiles);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Get appointment by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Parse files JSON string back to array
    const appointmentWithParsedFiles = {
      ...appointment,
      files: appointment.files ? JSON.parse(appointment.files) : [],
    };

    res.json(appointmentWithParsedFiles);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Create new appointment
router.post('/', async (req: Request, res: Response) => {
  try {
    const data = CreateAppointmentSchema.parse(req.body);

    // Convert files array to JSON string for storage
    const filesJson = data.files ? JSON.stringify(data.files) : null;

    const appointment = await prisma.appointment.create({
      data: {
        visitType: data.visitType,
        visitDuration: data.visitDuration,
        date: data.date,
        time: data.time,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        reasonForVisit: data.reasonForVisit,
        injuryDate: data.injuryDate,
        painScale: data.painScale,
        additionalNotes: data.additionalNotes,
        files: filesJson,
        status: 'Scheduled',
      },
    });

    // Parse files JSON string back to array for response
    const appointmentWithParsedFiles = {
      ...appointment,
      files: appointment.files ? JSON.parse(appointment.files) : [],
    };

    res.status(201).json(appointmentWithParsedFiles);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Update appointment
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = UpdateAppointmentSchema.parse(req.body);

    const appointment = await prisma.appointment.update({
      where: { id },
      data,
    });

    // Parse files JSON string back to array for response
    const appointmentWithParsedFiles = {
      ...appointment,
      files: appointment.files ? JSON.parse(appointment.files) : [],
    };

    res.json(appointmentWithParsedFiles);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Record to update not found')) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Cancel appointment (soft delete)
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status: 'Cancelled' },
    });

    // Parse files JSON string back to array for response
    const appointmentWithParsedFiles = {
      ...appointment,
      files: appointment.files ? JSON.parse(appointment.files) : [],
    };

    res.json(appointmentWithParsedFiles);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Record to update not found')) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Get appointments stats (for admin dashboard)
router.get('/stats/summary', async (req: Request, res: Response) => {
  try {
    const total = await prisma.appointment.count();
    const scheduled = await prisma.appointment.count({
      where: { status: 'Scheduled' },
    });
    const completed = await prisma.appointment.count({
      where: { status: 'Completed' },
    });
    const cancelled = await prisma.appointment.count({
      where: { status: 'Cancelled' },
    });

    res.json({
      total,
      scheduled,
      completed,
      cancelled,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

export default router;
