import { useEffect } from 'react';
import { differenceInHours, isFuture } from 'date-fns';
import { Appointment } from '../types';

const ReminderScheduler = () => {
    useEffect(() => {
        const checkAndSimulateReminders = () => {
            try {
                const storedAppointments: Appointment[] = JSON.parse(localStorage.getItem('userAppointments') || '[]');
                const now = new Date();
                let wasUpdated = false;

                const appointmentsToUpdate = storedAppointments.map(appt => {
                    // Dates from JSON need to be parsed back into Date objects
                    const startTime = new Date(appt.startTime);
                    
                    if (!isFuture(startTime)) {
                        return appt; // Skip past appointments
                    }

                    const hoursUntil = differenceInHours(startTime, now);

                    // Check for 24-hour reminder window (between 2 and 24 hours)
                    if (hoursUntil > 2 && hoursUntil <= 24 && !appt.reminder24hSent) {
                        console.log(`[REMINDER SIMULATION] Sending 24-hour Email & SMS reminder for appointment ID: ${appt.id} to ${appt.patient.firstName}.`);
                        appt.reminder24hSent = true;
                        wasUpdated = true;
                    }

                    // Check for 2-hour reminder window (2 hours or less)
                    if (hoursUntil >= 0 && hoursUntil <= 2 && !appt.reminder2hSent) {
                        console.log(`[REMINDER SIMULATION] Sending 2-hour Email & SMS reminder for appointment ID: ${appt.id} to ${appt.patient.firstName}.`);
                        appt.reminder2hSent = true;
                        wasUpdated = true;
                    }
                    
                    return appt;
                });
                
                if (wasUpdated) {
                    localStorage.setItem('userAppointments', JSON.stringify(appointmentsToUpdate));
                }

            } catch (error) {
                console.error("Failed to process appointment reminders:", error);
            }
        };
        
        checkAndSimulateReminders();
        // In a real application, a backend cron job would handle this.
        // For this simulation, we check once on load. A setInterval could also be used for a more active client-side check.

    }, []);

    return null; // This component does not render anything to the DOM.
};

export default ReminderScheduler;
