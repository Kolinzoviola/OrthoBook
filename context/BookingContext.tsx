import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Appointment, BookingContextType, IntakeDetails, PatientDetails, VisitType, AppointmentStatus } from '../types';
import { appointmentsAPI } from '../api/client';
import { apiAppointmentToAppointment, appointmentToAPIFormat } from '../api/adapters';

const BookingContext = createContext<BookingContextType | undefined>(undefined);

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

    try {
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
    } catch (error) {
      console.error("Could not create appointment:", error);
      throw error;
    }
  };
  
  const cancelAppointment = async (appointmentId: string) => {
    try {
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
    } catch (error) {
      console.error("Could not cancel appointment:", error);
      throw error;
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