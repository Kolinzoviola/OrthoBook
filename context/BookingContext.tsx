import React, { createContext, useState, useContext, ReactNode } from 'react';
import { add } from 'date-fns';
import { Appointment, BookingContextType, IntakeDetails, PatientDetails, VisitType, AppointmentStatus } from '../types';
import { MOCK_APPOINTMENTS } from '../constants';

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

  const createAppointment = () => {
    if (!selectedVisitType || !selectedSlot) return;

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
    
    // In a real app, this would be an API call.
    // Here we just add it to our mock data array.
    MOCK_APPOINTMENTS.push(newAppointment);
    setBookedAppointment(newAppointment);

    // Simulate scheduling reminders by saving to localStorage
    try {
        const existingAppointments = JSON.parse(localStorage.getItem('userAppointments') || '[]');
        localStorage.setItem('userAppointments', JSON.stringify([...existingAppointments, newAppointment]));
    } catch (error) {
        console.error("Could not save appointment for reminders:", error);
    }
  };
  
  const cancelAppointment = (appointmentId: string) => {
    try {
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
    } catch (error) {
        console.error("Could not cancel appointment:", error);
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