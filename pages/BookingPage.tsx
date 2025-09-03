import React, { useState, useMemo, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { VISIT_TYPES, generateTimeSlots } from '../constants';
import { VisitType, TimeSlot } from '../types';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, getDay, isBefore, startOfToday } from 'date-fns';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, ClockIcon, VideoCameraIcon } from '../components/icons';

const BookingPage = () => {
    const { step, setStep } = useBooking();

    const steps = [
        "Select Service",
        "Choose Date & Time",
        "Your Details",
        "Clinical Info",
        "Confirm"
    ];

    const renderStep = () => {
        switch (step) {
            case 1: return <Step1_SelectService />;
            case 2: return <Step2_SelectDateTime />;
            case 3: return <Step3_PatientDetails />;
            case 4: return <Step4_IntakeForm />;
            case 5: return <Step5_Confirm />;
            default: return <Step1_SelectService />;
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-2xl border border-gray-100">
                <h1 className="text-3xl font-bold text-center text-brand-blue mb-2">Book Your Appointment</h1>
                <p className="text-center text-gray-500 mb-8">Follow the steps below to secure your consultation.</p>

                {/* Progress Bar */}
                <div className="mb-12">
                    <div className="flex justify-between items-center">
                        {steps.map((s, index) => (
                            <React.Fragment key={s}>
                                <div className="flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step > index ? 'bg-brand-teal text-white' : 'bg-gray-200 text-gray-500'}`}>
                                        {step > index ? '✓' : index + 1}
                                    </div>
                                    <p className={`mt-2 text-xs text-center ${step >= index + 1 ? 'text-brand-teal font-semibold' : 'text-gray-500'}`}>{s}</p>
                                </div>
                                {index < steps.length - 1 && <div className={`flex-1 h-1 mx-2 ${step > index + 1 ? 'bg-brand-teal' : 'bg-gray-200'}`}></div>}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {renderStep()}
            </div>
        </div>
    );
};


const Step1_SelectService = () => {
    const { setSelectedVisitType, setStep } = useBooking();

    const handleSelect = (visitType: VisitType) => {
        setSelectedVisitType(visitType);
        setStep(2);
    };

    return (
        <div>
            <h2 className="text-xl font-semibold text-center text-gray-700 mb-6">What type of consultation do you need?</h2>
            <div className="grid md:grid-cols-2 gap-6">
                {VISIT_TYPES.map(vt => (
                    <button key={vt.id} onClick={() => handleSelect(vt)} className="p-6 border-2 border-gray-200 rounded-lg text-left hover:border-brand-teal hover:shadow-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-brand-teal">
                        <h3 className="text-lg font-bold text-brand-blue">{vt.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{vt.duration} minutes</p>
                        <p className="text-gray-500">{vt.description}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};


const Calendar = ({ selectedDate, onDateChange }: {selectedDate: Date, onDateChange: (date: Date) => void}) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const today = startOfToday();

    const renderHeader = () => (
        <div className="flex justify-between items-center mb-4">
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 rounded-full hover:bg-gray-100">
                <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
            </button>
            <span className="text-lg font-semibold text-gray-800">{format(currentMonth, 'MMMM yyyy')}</span>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 rounded-full hover:bg-gray-100">
                <ChevronRightIcon className="w-5 h-5 text-gray-600" />
            </button>
        </div>
    );

    const renderDays = () => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return (
            <div className="grid grid-cols-7 text-center text-xs text-gray-500 font-semibold">
                {days.map(day => <div key={day}>{day}</div>)}
            </div>
        );
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);
        const rows = [];
        let days = [];
        let day = startDate;

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                const cloneDay = day;
                const isDisabled = !isSameMonth(day, monthStart) || isBefore(day, today) || getDay(day) === 0 || getDay(day) === 6; // Disable past days & weekends
                days.push(
                    <div key={day.toString()} className="p-1">
                        <button
                            onClick={() => !isDisabled && onDateChange(cloneDay)}
                            disabled={isDisabled}
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition duration-200 
                                ${isDisabled ? 'text-gray-300 cursor-not-allowed' : 
                                isSameDay(day, selectedDate) ? 'bg-brand-teal text-white font-bold' : 
                                'text-gray-700 hover:bg-brand-teal-light'}`
                            }>
                            {format(day, 'd')}
                        </button>
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(<div className="grid grid-cols-7" key={day.toString()}>{days}</div>);
            days = [];
        }
        return <div>{rows}</div>;
    };
    
    return (
        <div className="p-4 border rounded-lg">
            {renderHeader()}
            {renderDays()}
            {renderCells()}
        </div>
    );
};


const Step2_SelectDateTime = () => {
    const { setStep, setSelectedSlot, selectedSlot } = useBooking();
    const [selectedDate, setSelectedDate] = useState(new Date());

    const timeSlots = useMemo(() => generateTimeSlots(selectedDate), [selectedDate]);

    return (
        <div>
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center"><CalendarIcon className="w-5 h-5 mr-2" />Select a Date</h3>
                    <Calendar selectedDate={selectedDate} onDateChange={setSelectedDate} />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center"><ClockIcon className="w-5 h-5 mr-2" />Select a Time</h3>
                    <p className="text-sm text-gray-500 mb-4">Timezone: Africa/Lagos</p>
                    <div className="grid grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-2">
                        {timeSlots.map(slot => (
                            <button key={slot.time.toISOString()}
                                onClick={() => setSelectedSlot(slot.time)}
                                disabled={!slot.available}
                                className={`p-2 border rounded-md text-center text-sm transition duration-200 
                                ${!slot.available ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 
                                selectedSlot?.getTime() === slot.time.getTime() ? 'bg-brand-teal text-white font-semibold' : 
                                'bg-white hover:bg-brand-teal-light'}`
                                }>
                                {format(slot.time, 'h:mm a')}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex justify-between mt-8">
                <button onClick={() => setStep(1)} className="text-gray-600 font-semibold py-2 px-4">Back</button>
                <button onClick={() => setStep(3)} disabled={!selectedSlot} className="bg-brand-teal text-white font-bold py-2 px-6 rounded-lg shadow disabled:bg-gray-400 disabled:cursor-not-allowed">Next</button>
            </div>
        </div>
    );
};


const Step3_PatientDetails = () => {
    const { setStep, patientDetails, setPatientDetails } = useBooking();
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPatientDetails({ ...patientDetails, [name]: value });
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!patientDetails.firstName.trim()) newErrors.firstName = 'First name is required.';
        if (!patientDetails.lastName.trim()) newErrors.lastName = 'Last name is required.';
        if (!patientDetails.email.trim()) {
            newErrors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(patientDetails.email)) {
            newErrors.email = 'Email address is invalid.';
        }
        if (!patientDetails.phone.trim()) {
            newErrors.phone = 'Phone number is required.';
        } else if (!/^\+?(\d[\s-]?){10,14}\d$/.test(patientDetails.phone)) {
            newErrors.phone = 'Phone number is invalid.';
        }
        return newErrors;
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setStep(4);
        }
    };

    return (
         <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                    <input type="text" name="firstName" id="firstName" value={patientDetails.firstName} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-brand-teal ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`} required/>
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input type="text" name="lastName" id="lastName" value={patientDetails.lastName} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-brand-teal ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`} required/>
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input type="email" name="email" id="email" value={patientDetails.email} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-brand-teal ${errors.email ? 'border-red-500' : 'border-gray-300'}`} required/>
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input type="tel" name="phone" id="phone" value={patientDetails.phone} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-brand-teal ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} required/>
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
            </div>
            <div className="flex justify-between mt-8">
                <button type="button" onClick={() => setStep(2)} className="text-gray-600 font-semibold py-2 px-4">Back</button>
                <button type="submit" className="bg-brand-teal text-white font-bold py-2 px-6 rounded-lg shadow">Next</button>
            </div>
        </form>
    );
};

const Step4_IntakeForm = () => {
    const { setStep, intakeDetails, setIntakeDetails, files, setFiles } = useBooking();
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setIntakeDetails({ ...intakeDetails, [name]: value });
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const uploadedFiles = Array.from(e.target.files);
            const newFiles = [...files];
            let fileError = '';

            for (const file of uploadedFiles) {
                if (newFiles.length >= 3) {
                    fileError = 'You can upload a maximum of 3 files.';
                    break;
                }
                if (file.size > 10 * 1024 * 1024) { // 10MB
                    fileError = `'${file.name}' is too large. Maximum size is 10MB.`;
                    // Don't add this file, but continue to check others
                    continue; 
                }
                newFiles.push(file);
            }
            
            setFiles(newFiles.slice(0, 3));
            setErrors(prev => ({ ...prev, files: fileError }));
        }
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!intakeDetails.reasonForVisit.trim()) newErrors.reasonForVisit = 'Reason for visit is required.';
        if (!intakeDetails.injuryDate) {
            newErrors.injuryDate = 'Injury date is required.';
        } else if (new Date(intakeDetails.injuryDate) > new Date()) {
            newErrors.injuryDate = 'Injury date cannot be in the future.';
        }
        return newErrors;
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(prev => ({ ...prev, ...validationErrors }));
        } else {
            setErrors({});
            setStep(5);
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-6">
                <div>
                    <label htmlFor="reasonForVisit" className="block text-sm font-medium text-gray-700">Reason for Visit</label>
                    <textarea name="reasonForVisit" id="reasonForVisit" value={intakeDetails.reasonForVisit} onChange={handleChange} rows={3} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-brand-teal ${errors.reasonForVisit ? 'border-red-500' : 'border-gray-300'}`} required></textarea>
                    {errors.reasonForVisit && <p className="text-red-500 text-xs mt-1">{errors.reasonForVisit}</p>}
                </div>
                 <div>
                    <label htmlFor="injuryDate" className="block text-sm font-medium text-gray-700">Approximate Date of Injury</label>
                    <input type="date" name="injuryDate" id="injuryDate" value={intakeDetails.injuryDate} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-brand-teal ${errors.injuryDate ? 'border-red-500' : 'border-gray-300'}`} required/>
                    {errors.injuryDate && <p className="text-red-500 text-xs mt-1">{errors.injuryDate}</p>}
                </div>
                <div>
                    <label htmlFor="painScale" className="block text-sm font-medium text-gray-700">Pain Scale (0=No Pain, 10=Worst Pain)</label>
                    <div className="flex items-center space-x-4 mt-1">
                        <input type="range" name="painScale" id="painScale" min="0" max="10" value={intakeDetails.painScale} onChange={(e) => setIntakeDetails({...intakeDetails, painScale: parseInt(e.target.value)})} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"/>
                        <span className="font-bold text-brand-blue w-8 text-center">{intakeDetails.painScale}</span>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Upload Imaging/Reports (Optional, up to 3 files)</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            <div className="flex text-sm text-gray-600">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-brand-teal hover:text-brand-blue focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-teal">
                                    <span>Upload files</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/jpeg,image/png,application/pdf" onChange={handleFileChange} disabled={files.length >= 3} />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB each</p>
                        </div>
                    </div>
                    {errors.files && <p className="text-red-500 text-xs mt-1">{errors.files}</p>}
                     {files.length > 0 && (
                        <div className="mt-4">
                            <h4 className="text-sm font-semibold">Uploaded files:</h4>
                            <ul className="list-disc list-inside">
                                {files.map((file, index) => <li key={index} className="text-sm text-gray-600">{file.name}</li>)}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
             <div className="flex justify-between mt-8">
                <button type="button" onClick={() => setStep(3)} className="text-gray-600 font-semibold py-2 px-4">Back</button>
                <button type="submit" className="bg-brand-teal text-white font-bold py-2 px-6 rounded-lg shadow">Next</button>
            </div>
        </form>
    );
};

const Step5_Confirm = () => {
    const { setStep, createAppointment, selectedSlot, selectedVisitType, patientDetails, intakeDetails } = useBooking();
    const navigate = useNavigate();
    const [consent, setConsent] = useState(false);

    const handleSubmit = () => {
        createAppointment();
        navigate('/confirmation');
    };

    if (!selectedVisitType || !selectedSlot) {
        return <p>Missing appointment details. Please go back.</p>;
    }
    
    return (
        <div>
            <h2 className="text-xl font-semibold text-center text-gray-700 mb-6">Please review and confirm your appointment</h2>
            <div className="bg-brand-teal-light p-6 rounded-lg space-y-4">
                <div className="flex justify-between items-center pb-4 border-b">
                    <div>
                        <p className="text-sm text-brand-teal font-semibold">Service</p>
                        <p className="font-bold text-lg text-brand-blue">{selectedVisitType.name}</p>
                    </div>
                    {selectedVisitType.name === "Video Consultation" && <VideoCameraIcon className="w-8 h-8 text-brand-teal"/>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <p className="text-sm text-brand-teal font-semibold">Date & Time</p>
                        <p className="text-gray-800">{format(selectedSlot, 'eeee, MMMM d, yyyy')} at {format(selectedSlot, 'h:mm a')}</p>
                    </div>
                    <div>
                        <p className="text-sm text-brand-teal font-semibold">Patient</p>
                        <p className="text-gray-800">{patientDetails.firstName} {patientDetails.lastName}</p>
                        <p className="text-gray-600 text-sm">{patientDetails.email}</p>
                    </div>
                </div>
                <div>
                    <p className="text-sm text-brand-teal font-semibold">Reason for Visit</p>
                    <p className="text-gray-800">{intakeDetails.reasonForVisit}</p>
                </div>
            </div>
            
             <div className="mt-6">
                <label className="flex items-start">
                    <input type="checkbox" checked={consent} onChange={() => setConsent(!consent)} className="h-5 w-5 mt-1 text-brand-teal rounded border-gray-300 focus:ring-brand-teal"/>
                    <span className="ml-3 text-sm text-gray-600">
                        I acknowledge and consent to the <a href="#" className="text-brand-teal underline">Telemedicine Policy</a> and <a href="#" className="text-brand-teal underline">Data Processing Agreement</a>.
                    </span>
                </label>
            </div>

            <div className="flex justify-between mt-8">
                <button type="button" onClick={() => setStep(4)} className="text-gray-600 font-semibold py-2 px-4">Back</button>
                <button onClick={handleSubmit} disabled={!consent} className="bg-brand-blue hover:bg-brand-blue-dark text-white font-bold py-3 px-8 rounded-lg shadow-lg text-lg disabled:bg-gray-400 disabled:cursor-not-allowed">Confirm Booking</button>
            </div>
        </div>
    );
};

export default BookingPage;