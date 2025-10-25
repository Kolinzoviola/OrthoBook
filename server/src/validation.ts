import { z } from 'zod';

export const VisitTypeEnum = z.enum(['InPerson', 'Video']);

export const AppointmentStatusEnum = z.enum(['Scheduled', 'Completed', 'Cancelled']);

export const CreateAppointmentSchema = z.object({
  visitType: VisitTypeEnum,
  visitDuration: z.number().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().min(1).max(20),
  reasonForVisit: z.string().min(1).max(500),
  injuryDate: z.string().optional(),
  painScale: z.number().min(1).max(10).optional(),
  additionalNotes: z.string().max(1000).optional(),
  files: z.array(z.string()).optional(),
});

export const UpdateAppointmentSchema = z.object({
  status: AppointmentStatusEnum.optional(),
  reasonForVisit: z.string().min(1).max(500).optional(),
  injuryDate: z.string().optional(),
  painScale: z.number().min(1).max(10).optional(),
  additionalNotes: z.string().max(1000).optional(),
  reminder24hSent: z.boolean().optional(),
  reminder2hSent: z.boolean().optional(),
});

export const GetAppointmentsQuerySchema = z.object({
  status: AppointmentStatusEnum.optional(),
  email: z.string().email().optional(),
  date: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type CreateAppointmentInput = z.infer<typeof CreateAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof UpdateAppointmentSchema>;
export type GetAppointmentsQuery = z.infer<typeof GetAppointmentsQuerySchema>;
