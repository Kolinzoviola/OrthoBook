import { Appointment, VisitType, AppointmentStatus, VisitTypeEnum } from '../types';
import { parse } from 'date-fns';

// API Response types (what the backend returns)
export interface APIAppointment {
  id: string;
  visitType: 'InPerson' | 'Video';
  visitDuration: number;
  date: string; // ISO date string
  time: string; // Time string like "9:00 AM"
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  reasonForVisit: string;
  injuryDate?: string;
  painScale?: number;
  additionalNotes?: string;
  files?: string[];
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  reminder24hSent?: boolean;
  reminder2hSent?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface APIVisitType {
  id: string;
  name: string;
  duration: number;
  description: string;
}

// Convert API appointment to frontend Appointment
export function apiAppointmentToAppointment(apiAppt: APIAppointment): Appointment {
  // Parse date and time into Date objects
  const dateTimeStr = `${apiAppt.date} ${apiAppt.time}`;
  const startTime = parse(dateTimeStr, 'yyyy-MM-dd h:mm a', new Date());
  const endTime = new Date(startTime.getTime() + apiAppt.visitDuration * 60000);

  // Map visit type string to VisitTypeEnum
  const visitTypeName = apiAppt.visitType === 'InPerson'
    ? VisitTypeEnum.InPerson
    : VisitTypeEnum.Video;

  return {
    id: apiAppt.id,
    patient: {
      firstName: apiAppt.firstName,
      lastName: apiAppt.lastName,
      email: apiAppt.email,
      phone: apiAppt.phone,
    },
    visitType: {
      id: apiAppt.visitType.toLowerCase(),
      name: visitTypeName,
      duration: apiAppt.visitDuration,
      description: apiAppt.visitType === 'InPerson'
        ? 'Face-to-face consultation at our clinic'
        : 'Virtual consultation with Dr. Collins via secure video call',
    },
    startTime,
    endTime,
    status: AppointmentStatus[apiAppt.status],
    intake: {
      reasonForVisit: apiAppt.reasonForVisit,
      injuryDate: apiAppt.injuryDate || '',
      painScale: apiAppt.painScale || 5,
    },
    files: [], // File objects can't be reconstructed from strings
    reminder24hSent: apiAppt.reminder24hSent,
    reminder2hSent: apiAppt.reminder2hSent,
  };
}

// Convert API visit type to frontend VisitType
export function apiVisitTypeToVisitType(apiVt: APIVisitType): VisitType {
  const visitTypeName = apiVt.name === 'Video Consultation'
    ? VisitTypeEnum.Video
    : VisitTypeEnum.InPerson;

  return {
    id: apiVt.id,
    name: visitTypeName,
    duration: apiVt.duration,
    description: apiVt.description,
  };
}

// Convert frontend appointment data to API format
export function appointmentToAPIFormat(
  visitType: VisitType,
  selectedSlot: Date,
  patient: { firstName: string; lastName: string; email: string; phone: string },
  intake: { reasonForVisit: string; injuryDate: string; painScale: number },
  files?: File[]
) {
  // Format date as YYYY-MM-DD
  const date = selectedSlot.toISOString().split('T')[0];

  // Format time as "H:MM AM/PM"
  const hours = selectedSlot.getHours();
  const minutes = selectedSlot.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const time = `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;

  return {
    visitType: visitType.id === 'video' ? 'Video' : 'InPerson',
    visitDuration: visitType.duration,
    date,
    time,
    firstName: patient.firstName,
    lastName: patient.lastName,
    email: patient.email,
    phone: patient.phone,
    reasonForVisit: intake.reasonForVisit,
    injuryDate: intake.injuryDate || undefined,
    painScale: intake.painScale,
    files: files?.map(f => f.name), // Just store file names
  };
}
