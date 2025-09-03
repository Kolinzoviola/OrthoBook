
import { VisitType, VisitTypeEnum, TimeSlot, Appointment, AppointmentStatus, PatientDetails, IntakeDetails } from './types';
import { add, set } from 'date-fns';

export const VISIT_TYPES: VisitType[] = [
  {
    id: 'video-20',
    name: VisitTypeEnum.Video,
    duration: 20,
    description: 'A 20-minute video call to discuss your condition and treatment options.',
  },
  {
    id: 'in-person-30',
    name: VisitTypeEnum.InPerson,
    duration: 30,
    description: 'A 30-minute in-person examination at our clinic.',
  },
];

export const generateTimeSlots = (date: Date): TimeSlot[] => {
    const startOfDay = set(date, { hours: 9, minutes: 0, seconds: 0, milliseconds: 0 });
    const endOfDay = set(date, { hours: 16, minutes: 30, seconds: 0, milliseconds: 0 });
    const slots: TimeSlot[] = [];
    let currentTime = startOfDay;

    while (currentTime <= endOfDay) {
        slots.push({
            time: currentTime,
            available: Math.random() > 0.3, // Simulate random availability
        });
        currentTime = add(currentTime, { minutes: 30 });
    }
    return slots;
};

const tomorrow = add(new Date(), { days: 1 });
const dayAfter = add(new Date(), { days: 2 });

const mockPatient1: PatientDetails = { firstName: 'Adebayo', lastName: 'Ojo', email: 'a.ojo@example.com', phone: '08012345678' };
const mockIntake1: IntakeDetails = { reasonForVisit: 'Knee pain', injuryDate: '2023-10-15', painScale: 7 };
const mockPatient2: PatientDetails = { firstName: 'Fatima', lastName: 'Bello', email: 'f.bello@example.com', phone: '08087654321' };
const mockIntake2: IntakeDetails = { reasonForVisit: 'Shoulder dislocation follow-up', injuryDate: '2023-09-01', painScale: 4 };

export const MOCK_APPOINTMENTS: Appointment[] = [
    {
        id: 'appt-123',
        patient: mockPatient1,
        visitType: VISIT_TYPES[0],
        startTime: set(tomorrow, { hours: 10, minutes: 0 }),
        endTime: set(tomorrow, { hours: 10, minutes: 20 }),
        status: AppointmentStatus.Scheduled,
        intake: mockIntake1,
        files: []
    },
    {
        id: 'appt-456',
        patient: mockPatient2,
        visitType: VISIT_TYPES[1],
        startTime: set(tomorrow, { hours: 14, minutes: 30 }),
        endTime: set(tomorrow, { hours: 15, minutes: 0 }),
        status: AppointmentStatus.Scheduled,
        intake: mockIntake2,
        files: []
    },
    {
        id: 'appt-789',
        patient: { firstName: 'Chioma', lastName: 'Okoro', email: 'c.okoro@example.com', phone: '09011223344' },
        visitType: VISIT_TYPES[0],
        startTime: set(dayAfter, { hours: 11, minutes: 0 }),
        endTime: set(dayAfter, { hours: 11, minutes: 20 }),
        status: AppointmentStatus.Scheduled,
        intake: { reasonForVisit: 'Ankle sprain', injuryDate: '2023-11-01', painScale: 6 },
        files: []
    }
];
