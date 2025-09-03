import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { MOCK_APPOINTMENTS } from '../constants';
import { MicrophoneIcon, MicrophoneOffIcon, VideoCameraIcon, VideoCameraSlashIcon, PhoneOffIcon } from '../components/icons';

const TelemedicinePage = () => {
    const { id } = useParams();
    const appointment = MOCK_APPOINTMENTS.find(a => a.id === id);

    const [isMicOn, setIsMicOn] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [callStatus, setCallStatus] = useState<'pre-call' | 'waiting' | 'in-call' | 'ended'>('pre-call');
    const [error, setError] = useState<string | null>(null);

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const localStreamRef = useRef<MediaStream | null>(null);

    const startMedia = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
            localStreamRef.current = stream;
            setError(null);
            setCallStatus('waiting');
        } catch (err) {
            console.error("Error accessing media devices.", err);
            setError("Could not access camera and microphone. Please check your browser permissions.");
            setCallStatus('pre-call');
        }
    };
    
    useEffect(() => {
       // Simulate doctor joining after a delay
       if (callStatus === 'waiting') {
           const timer = setTimeout(() => {
               setCallStatus('in-call');
           }, 5000);
           return () => clearTimeout(timer);
       }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [callStatus]);

    useEffect(() => {
        return () => {
            // Cleanup: stop media stream when component unmounts
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const toggleMic = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach(track => track.enabled = !isMicOn);
            setIsMicOn(!isMicOn);
        }
    };

    const toggleCamera = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getVideoTracks().forEach(track => track.enabled = !isCameraOn);
            setIsCameraOn(!isCameraOn);
        }
    };

    const endCall = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
        }
        setCallStatus('ended');
    };

    if (!appointment) {
        return <div className="text-center py-20">Appointment not found.</div>;
    }
    
    const renderContent = () => {
        switch (callStatus) {
            case 'pre-call':
                return (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Ready for your call?</h2>
                        <p className="text-gray-600 mb-6">Let's check your camera and microphone before you join.</p>
                        {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}
                        <button onClick={startMedia} className="bg-brand-teal text-white font-bold py-3 px-8 rounded-lg shadow-lg">
                            Join Visit
                        </button>
                    </div>
                );
            case 'waiting':
                return (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">You're in the waiting room</h2>
                        <p className="text-gray-600">Dr. Collins will be with you shortly.</p>
                         <div className="animate-pulse mt-4 text-brand-teal">Connecting...</div>
                    </div>
                );
            case 'in-call':
                 return <></>; // Handled by main layout for in-call
            case 'ended':
                return (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Call Ended</h2>
                        <p className="text-gray-600 mb-6">Your consultation has concluded. A summary will be sent to your email.</p>
                        <a href="/#/" className="bg-brand-blue text-white font-bold py-3 px-8 rounded-lg shadow-lg">
                            Back to Home
                        </a>
                    </div>
                );
        }
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4 relative">
            {callStatus === 'pre-call' || callStatus === 'waiting' || callStatus === 'ended' ? (
                <div className="bg-white text-gray-800 p-10 rounded-xl shadow-2xl max-w-lg w-full">
                    {renderContent()}
                </div>
            ) : (
                <>
                    {/* Remote Video (Doctor) */}
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="aspect-video bg-black rounded-lg w-full max-w-6xl relative overflow-hidden">
                             {/* FIX: Replaced img with video tag to match the ref type HTMLVideoElement. The image is used as a poster. */}
                             <video poster="https://picsum.photos/id/1005/1280/720" ref={remoteVideoRef} className="w-full h-full object-cover" autoPlay playsInline aria-label="Remote participant"></video>
                             <div className="absolute top-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded-md text-sm">Dr. Collins</div>
                        </div>
                    </div>

                    {/* Local Video (Patient) */}
                    <div className="absolute bottom-24 right-6 md:bottom-28 md:right-10 w-40 h-24 md:w-64 md:h-36 rounded-lg overflow-hidden shadow-2xl border-2 border-gray-600">
                        <video ref={localVideoRef} autoPlay muted className="w-full h-full object-cover"></video>
                        {!isCameraOn && <div className="absolute inset-0 bg-black flex items-center justify-center"><VideoCameraSlashIcon className="w-8 h-8"/></div>}
                         <div className="absolute top-2 left-2 bg-black bg-opacity-50 px-2 py-0.5 rounded-md text-xs">You</div>
                    </div>

                    {/* Controls */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gray-900 bg-opacity-80 py-4 flex justify-center items-center space-x-4">
                        <button onClick={toggleMic} className={`p-3 rounded-full ${isMicOn ? 'bg-gray-600' : 'bg-red-600'}`}>
                            {isMicOn ? <MicrophoneIcon className="w-6 h-6" /> : <MicrophoneOffIcon className="w-6 h-6" />}
                        </button>
                        <button onClick={toggleCamera} className={`p-3 rounded-full ${isCameraOn ? 'bg-gray-600' : 'bg-red-600'}`}>
                            {isCameraOn ? <VideoCameraIcon className="w-6 h-6" /> : <VideoCameraSlashIcon className="w-6 h-6" />}
                        </button>
                         <button onClick={endCall} className="p-3 rounded-full bg-red-600 hover:bg-red-700">
                            <PhoneOffIcon className="w-6 h-6" />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default TelemedicinePage;