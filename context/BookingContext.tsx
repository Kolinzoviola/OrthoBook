import React, { createContext, useState, useContext, ReactNode } from 'react';
import { add } from 'date-fns';
import { Appointment, BookingContextType, IntakeDetails, PatientDetails, VisitType, AppointmentStatus } from '../types';
import { appointmentsAPI } from '../api/client';
import { apiAppointmentToAppointment, appointmentToAPIFormat } from '../api/adapters';
import { MOCK_APPOINTMENTS } from '../constants';

const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Check if backend is available
const USE_BACKEND = import.meta.env.VITE_API_URL ? true : false;

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [step, setStep] = useState(1);
  const [selectedVisitType, setSelectedVisitType] = useState<VisitType | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [patientDetails, setPatientDetails] = useState<PatientDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [intakeDetails, setIntakeDetails] = useState<IntakeDetails>({
    reasonForVisit: '',
    injuryDate: '',
    painScale: 5,
  });
  const [files, setFiles] = useState<File[]>([]);
  const [bookedAppointment, setBookedAppointment] = useState<Appointment | null>(null);

  const createAppointment = async () => {
    if (!selectedVisitType || !selectedSlot) return;

    // Try API first, fallback to localStorage
    try {
      if (USE_BACKEND) {
        const appointmentData = appointmentToAPIFormat(
          selectedVisitType,
          selectedSlot,
          patientDetails,
          intakeDetails,
          files
        );

        const apiAppointment = await appointmentsAPI.create(appointmentData);
        const newAppointment = apiAppointmentToAppointment(apiAppointment as any);

        setBookedAppointment(newAppointment);

        // Also save to localStorage for reminder functionality
        try {
          const existingAppointments = JSON.parse(localStorage.getItem('userAppointments') || '[]');
          localStorage.setItem('userAppointments', JSON.stringify([...existingAppointments, newAppointment]));
        } catch (error) {
          console.error("Could not save appointment for reminders:", error);
        }
      } else {
        // Fallback to localStorage mode
        const newAppointment: Appointment = {
          id: `appt-${Math.random().toString(36).substr(2, 9)}`,
          patient: patientDetails,
          visitType: selectedVisitType,
          startTime: selectedSlot,
          endTime: add(selectedSlot, { minutes: selectedVisitType.duration }),
          status: AppointmentStatus.Scheduled,
          intake: intakeDetails,
          files,
        };

        MOCK_APPOINTMENTS.push(newAppointment);
        setBookedAppointment(newAppointment);

        try {
          const existingAppointments = JSON.parse(localStorage.getItem('userAppointments') || '[]');
          localStorage.setItem('userAppointments', JSON.stringify([...existingAppointments, newAppointment]));
        } catch (error) {
          console.error("Could not save appointment for reminders:", error);
        }
      }
    } catch (error) {
      console.error("Could not create appointment, falling back to localStorage mode:", error);
      // Fallback to localStorage if API fails
      const newAppointment: Appointment = {
        id: `appt-${Math.random().toString(36).substr(2, 9)}`,
        patient: patientDetails,
        visitType: selectedVisitType,
        startTime: selectedSlot,
        endTime: add(selectedSlot, { minutes: selectedVisitType.duration }),
        status: AppointmentStatus.Scheduled,
        intake: intakeDetails,
        files,
      };

      MOCK_APPOINTMENTS.push(newAppointment);
      setBookedAppointment(newAppointment);

      try {
        const existingAppointments = JSON.parse(localStorage.getItem('userAppointments') || '[]');
        localStorage.setItem('userAppointments', JSON.stringify([...existingAppointments, newAppointment]));
      } catch (error) {
        console.error("Could not save appointment for reminders:", error);
      }
    }
  };
  
  const cancelAppointment = async (appointmentId: string) => {
    try {
      if (USE_BACKEND) {
        const cancelledAppointment = await appointmentsAPI.cancel(appointmentId);
        const updatedAppointment = apiAppointmentToAppointment(cancelledAppointment as any);

        // Update localStorage
        const existingAppointments: Appointment[] = JSON.parse(localStorage.getItem('userAppointments') || '[]');
        const updatedAppointments = existingAppointments.map(appt =>
            appt.id === appointmentId ? { ...appt, status: AppointmentStatus.Cancelled } : appt
        );
        localStorage.setItem('userAppointments', JSON.stringify(updatedAppointments));

        if (bookedAppointment && bookedAppointment.id === appointmentId) {
          setBookedAppointment(updatedAppointment);
        }
        console.log(`Appointment ${appointmentId} cancelled.`);
      } else {
        // Fallback to localStorage mode
        const apptIndex = MOCK_APPOINTMENTS.findIndex(a => a.id === appointmentId);
        if (apptIndex > -1) {
          MOCK_APPOINTMENTS[apptIndex].status = AppointmentStatus.Cancelled;
        }

        const existingAppointments: Appointment[] = JSON.parse(localStorage.getItem('userAppointments') || '[]');
        const updatedAppointments = existingAppointments.map(appt =>
            appt.id === appointmentId ? { ...appt, status: AppointmentStatus.Cancelled } : appt
        );
        localStorage.setItem('userAppointments', JSON.stringify(updatedAppointments));

        if (bookedAppointment && bookedAppointment.id === appointmentId) {
          setBookedAppointment({ ...bookedAppointment, status: AppointmentStatus.Cancelled });
        }
        console.log(`Appointment ${appointmentId} cancelled.`);
      }
    } catch (error) {
      console.error("Could not cancel appointment, using fallback:", error);
      // Fallback to localStorage if API fails
      const apptIndex = MOCK_APPOINTMENTS.findIndex(a => a.id === appointmentId);
      if (apptIndex > -1) {
        MOCK_APPOINTMENTS[apptIndex].status = AppointmentStatus.Cancelled;
      }

      const existingAppointments: Appointment[] = JSON.parse(localStorage.getItem('userAppointments') || '[]');
      const updatedAppointments = existingAppointments.map(appt =>
          appt.id === appointmentId ? { ...appt, status: AppointmentStatus.Cancelled } : appt
      );
      localStorage.setItem('userAppointments', JSON.stringify(updatedAppointments));

      if (bookedAppointment && bookedAppointment.id === appointmentId) {
        setBookedAppointment({ ...bookedAppointment, status: AppointmentStatus.Cancelled });
      }
    }
  };

  const resetBooking = () => {
      setStep(1);
      setSelectedVisitType(null);
      setSelectedSlot(null);
      setPatientDetails({ firstName: '', lastName: '', email: '', phone: '' });
      setIntakeDetails({ reasonForVisit: '', injuryDate: '', painScale: 5 });
      setFiles([]);
      setBookedAppointment(null);
  };

  const value = {
    step,
    setStep,
    selectedVisitType,
    setSelectedVisitType,
    selectedSlot,
    setSelectedSlot,
    patientDetails,
    setPatientDetails,
    intakeDetails,
    setIntakeDetails,
    files,
    setFiles,
    bookedAppointment,
    createAppointment,
    resetBooking,
    cancelAppointment,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};