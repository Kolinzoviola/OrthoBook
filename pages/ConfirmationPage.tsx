import React, { useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { format } from 'date-fns';
import { CheckCircleIcon, CalendarIcon, ClockIcon, VideoCameraIcon, XCircleIcon } from '../components/icons';
import { AppointmentStatus } from '../types';

const ConfirmationPage = () => {
    const { bookedAppointment, resetBooking, cancelAppointment } = useBooking();

    useEffect(() => {
        // This function will be called when the component unmounts
        return () => {
            resetBooking();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCancel = () => {
        if (bookedAppointment && window.confirm("Are you sure you want to cancel this appointment?")) {
            cancelAppointment(bookedAppointment.id);
        }
    };


    if (!bookedAppointment) {
        return <Navigate to="/book" />;
    }

    const { id, patient, visitType, startTime } = bookedAppointment;
    const isCancelled = bookedAppointment.status === AppointmentStatus.Cancelled;

    const exportToIcs = () => {
        const formatForIcs = (date: Date) => format(date, "yyyyMMdd'T'HHmmss'Z'");
        
        const event = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'BEGIN:VEVENT',
            `UID:${id}@collinsortho.care`,
            `DTSTAMP:${formatForIcs(new Date())}`,
            `DTSTART:${formatForIcs(startTime)}`,
            `DTEND:${formatForIcs(new Date(startTime.getTime() + visitType.duration * 60000))}`,
            `SUMMARY:Consultation with Dr. Collins for ${patient.firstName} ${patient.lastName}`,
            `DESCRIPTION:Your ${visitType.name} is confirmed. ${visitType.name === "Video Consultation" ? `Join link: ${window.location.origin}/#/visit/${id}` : 'Location: 123 Healthway, Lagos, Nigeria'}`,
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\n');

        const blob = new Blob([event], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'appointment.ics';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-2xl border border-gray-100 text-center">
                
                {isCancelled ? (
                    <>
                        <XCircleIcon className="w-20 h-20 text-red-500 mx-auto mb-4" />
                        <h1 className="text-3xl font-bold text-brand-blue mb-2">Appointment Cancelled</h1>
                        <p className="text-gray-600 mb-6">Your appointment for {format(startTime, 'eeee, MMMM d')} has been successfully cancelled.</p>
                        <Link to="/" className="bg-brand-blue hover:bg-brand-blue-dark text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300">
                            Back to Home
                        </Link>
                    </>
                ) : (
                    <>
                        <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
                        <h1 className="text-3xl font-bold text-brand-blue mb-2">Appointment Confirmed!</h1>
                        <p className="text-gray-600 mb-6">Thank you, {patient.firstName}. Your appointment has been successfully booked.</p>

                        <div className="bg-brand-gray p-6 rounded-lg text-left space-y-4 mb-8">
                            <h2 className="text-lg font-semibold text-brand-blue-dark border-b pb-2">Appointment Details</h2>
                            <div>
                                <p className="text-sm text-gray-500">Service</p>
                                <p className="font-medium text-gray-800 flex items-center">
                                {visitType.name === "Video Consultation" && <VideoCameraIcon className="w-5 h-5 mr-2 text-brand-teal"/>}
                                {visitType.name}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Date & Time</p>
                                <p className="font-medium text-gray-800 flex items-center">
                                    <CalendarIcon className="w-5 h-5 mr-2 text-brand-teal"/> {format(startTime, 'eeee, MMMM d, yyyy')}
                                </p>
                                <p className="font-medium text-gray-800 flex items-center ml-7">
                                    <ClockIcon className="w-5 h-5 mr-2 text-brand-teal"/> {format(startTime, 'h:mm a')} (Africa/Lagos)
                                </p>
                            </div>
                        </div>
                        
                        <p className="text-sm text-gray-500 mb-8">A confirmation email and SMS with these details have been sent to you. You will also receive a reminder 24 hours and 2 hours before your appointment.</p>
                        
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                        {visitType.name === "Video Consultation" && (
                                <Link to={`/visit/${id}`} className="bg-brand-blue hover:bg-brand-blue-dark text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300">
                                    Go to Waiting Room
                                </Link>
                            )}
                            <button onClick={exportToIcs} className="bg-white border-2 border-brand-teal text-brand-teal hover:bg-brand-teal-light font-bold py-3 px-6 rounded-lg transition duration-300">
                                Add to Calendar
                            </button>
                        </div>

                        <div className="mt-8 border-t pt-6">
                            <p className="text-sm text-gray-600 mb-4">Need to make a change?</p>
                            <button onClick={handleCancel} className="bg-red-100 text-red-700 hover:bg-red-200 font-bold py-2 px-6 rounded-lg transition duration-300">
                                Cancel Appointment
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ConfirmationPage;