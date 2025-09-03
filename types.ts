export enum VisitTypeEnum {
  InPerson = 'In-Person Consultation',
  Video = 'Video Consultation',
}

export interface VisitType {
  id: string;
  name: VisitTypeEnum;
  duration: number; // in minutes
  description: string;
}

export interface TimeSlot {
  time: Date;
  available: boolean;
}

export interface PatientDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface IntakeDetails {
  reasonForVisit: string;
  injuryDate: string;
  painScale: number;
}

export enum AppointmentStatus {
    Scheduled = 'Scheduled',
    Completed = 'Completed',
    Cancelled = 'Cancelled'
}

export interface Appointment {
  id: string;
  patient: PatientDetails;
  visitType: VisitType;
  startTime: Date;
  endTime: Date;
  status: AppointmentStatus;
  intake: IntakeDetails;
  files: File[];
  reminder24hSent?: boolean;
  reminder2hSent?: boolean;
}

export interface BookingContextType {
  step: number;
  setStep: (step: number) => void;
  selectedVisitType: VisitType | null;
  setSelectedVisitType: (visitType: VisitType) => void;
  selectedSlot: Date | null;
  setSelectedSlot: (slot: Date | null) => void;
  patientDetails: PatientDetails;
  setPatientDetails: (details: PatientDetails) => void;
  intakeDetails: IntakeDetails;
  setIntakeDetails: (details: IntakeDetails) => void;
  files: File[];
  setFiles: (files: File[]) => void;
  bookedAppointment: Appointment | null;
  createAppointment: () => void;
  resetBooking: () => void;
  cancelAppointment: (appointmentId: string) => void;
}