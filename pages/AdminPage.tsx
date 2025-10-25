import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Appointment, VisitTypeEnum, AppointmentStatus } from '../types';
import { VideoCameraIcon, DownloadIcon } from '../components/icons';
import { appointmentsAPI } from '../api/client';
import { apiAppointmentToAppointment } from '../api/adapters';
import { MOCK_APPOINTMENTS } from '../constants';

// Check if backend is available
const USE_BACKEND = import.meta.env.VITE_API_URL ? true : false;

const AdminPage = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [usingFallback, setUsingFallback] = useState(false);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                setLoading(true);
                if (USE_BACKEND) {
                    const apiAppointments = await appointmentsAPI.getAll();
                    const convertedAppointments = apiAppointments.map(appt => apiAppointmentToAppointment(appt as any));
                    setAppointments(convertedAppointments);
                    setUsingFallback(false);
                } else {
                    // Fallback to mock data
                    setAppointments(MOCK_APPOINTMENTS);
                    setUsingFallback(true);
                }
                setError(null);
            } catch (err) {
                console.error('Failed to fetch appointments, using fallback data:', err);
                // Fallback to mock data if API fails
                setAppointments(MOCK_APPOINTMENTS);
                setUsingFallback(true);
                setError(null); // Clear error since we're using fallback
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    // Sort appointments by start time
    const sortedAppointments = [...appointments].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    const triggerDownload = (filename: string, content: string, mimeType: string) => {
        const blob = new Blob([content], { type: mimeType });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportCSV = () => {
        const headers = ["Patient Name", "Email", "Visit Type", "Date", "Start Time", "End Time", "Status"];
        const rows = sortedAppointments.map(appt => [
            `"${appt.patient.firstName} ${appt.patient.lastName}"`,
            appt.patient.email,
            appt.visitType.name,
            format(appt.startTime, 'yyyy-MM-dd'),
            format(appt.startTime, 'HH:mm'),
            format(appt.endTime, 'HH:mm'),
            appt.status
        ].join(','));

        const csvContent = [headers.join(','), ...rows].join('\n');
        triggerDownload('appointments.csv', csvContent, 'text/csv;charset=utf-8;');
    };
    
    const handleExportICS = () => {
        const formatForIcs = (date: Date) => format(date, "yyyyMMdd'T'HHmmss'Z'");

        const events = sortedAppointments
            .filter(appt => appt.status === AppointmentStatus.Scheduled)
            .map(appt => {
            const location = appt.visitType.name === VisitTypeEnum.InPerson 
                ? '123 Healthway, Lagos, Nigeria'
                : `Video Call: ${window.location.origin}/#/visit/${appt.id}`;
            const description = `Reason: ${appt.intake.reasonForVisit}. Contact: ${appt.patient.email}, ${appt.patient.phone}`;

            return [
                'BEGIN:VEVENT',
                `UID:${appt.id}@collinsortho.care`,
                `DTSTAMP:${formatForIcs(new Date())}`,
                `DTSTART:${formatForIcs(new Date(appt.startTime))}`,
                `DTEND:${formatForIcs(new Date(appt.endTime))}`,
                `SUMMARY:Consultation: ${appt.patient.firstName} ${appt.patient.lastName} (${appt.visitType.name})`,
                `DESCRIPTION:${description.replace(/(\r\n|\n|\r)/gm, " ")}`, // Clean description
                `LOCATION:${location}`,
                'END:VEVENT'
            ].join('\n');
        }).join('\n');

        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//CollinsOrthoCare//AppointmentExporter//EN',
            events,
            'END:VCALENDAR'
        ].join('\n');

        triggerDownload('appointments.ics', icsContent, 'text/calendar;charset=utf-8;');
    };


    const AppointmentCard = ({ appt }: { appt: Appointment }) => (
        <div className={`bg-white rounded-lg shadow-md p-5 border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${appt.status === AppointmentStatus.Cancelled ? 'opacity-50' : ''}`}>
            <div className="flex-1">
                <div className="flex items-center mb-2">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        appt.status === AppointmentStatus.Cancelled ? 'bg-gray-200 text-gray-600' :
                        appt.visitType.name === VisitTypeEnum.Video 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                        {appt.status === AppointmentStatus.Cancelled ? 'Cancelled' : appt.visitType.name}
                    </span>
                    <span className="ml-3 text-sm text-gray-500">{format(appt.startTime, 'h:mm a')} - {format(appt.endTime, 'h:mm a')}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800">{appt.patient.firstName} {appt.patient.lastName}</h3>
                <p className="text-sm text-gray-600">{appt.patient.email}</p>
                <p className="text-sm text-gray-600 mt-2"><strong>Reason:</strong> {appt.intake.reasonForVisit}</p>
            </div>
            <div className="w-full sm:w-auto flex flex-col sm:items-end gap-2 mt-4 sm:mt-0">
                {appt.visitType.name === VisitTypeEnum.Video && appt.status !== AppointmentStatus.Cancelled && (
                    <Link to={`/visit/${appt.id}`} className="w-full sm:w-auto flex items-center justify-center bg-brand-teal text-white font-semibold py-2 px-4 rounded-md hover:bg-opacity-90 transition">
                        <VideoCameraIcon className="w-5 h-5 mr-2" />
                        Join Video Call
                    </Link>
                )}
                {appt.status !== AppointmentStatus.Cancelled && (
                    <div className="flex gap-2">
                        <button className="text-sm text-gray-500 hover:text-gray-800">Reschedule</button>
                        <button className="text-sm text-red-500 hover:text-red-700">Cancel</button>
                    </div>
                )}
            </div>
        </div>
    );

    // Group appointments by day
    const groupedAppointments = sortedAppointments.reduce((acc, appt) => {
        const dateKey = format(appt.startTime, 'yyyy-MM-dd');
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(appt);
        return acc;
    }, {} as Record<string, Appointment[]>);


    if (loading) {
        return (
            <div className="bg-brand-gray min-h-full flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading appointments...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-brand-gray min-h-full flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-brand-blue text-white px-6 py-2 rounded-md hover:bg-brand-blue-dark transition"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-brand-gray min-h-full">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-brand-blue">Admin Dashboard</h1>
                    <div className="flex gap-3">
                        <button onClick={handleExportCSV} className="flex items-center bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-50 transition text-sm">
                            <DownloadIcon className="w-5 h-5 mr-2" />
                            Export as CSV
                        </button>
                         <button onClick={handleExportICS} className="flex items-center bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-50 transition text-sm">
                            <DownloadIcon className="w-5 h-5 mr-2" />
                            Export as iCal (.ics)
                        </button>
                    </div>
                </div>

                {usingFallback && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
                        <p className="text-yellow-800 text-sm">
                            <strong>Demo Mode:</strong> Backend API is not connected. Using sample data for demonstration purposes.
                        </p>
                    </div>
                )}

                <div className="space-y-8">
                    {Object.keys(groupedAppointments).map(dateKey => (
                        <div key={dateKey}>
                            <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b-2 border-gray-200">
                                {format(new Date(dateKey), 'eeee, MMMM d')}
                            </h2>
                            <div className="space-y-4">
                                {groupedAppointments[dateKey].map(appt => <AppointmentCard key={appt.id} appt={appt} />)}
                            </div>
                        </div>
                    ))}
                    {Object.keys(groupedAppointments).length === 0 && (
                        <p className="text-center text-gray-500 py-10">No upcoming appointments.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;