
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FeatureCard = ({ title, description, icon }: { title: string, description: string, icon: React.ReactNode}) => (
    <div className="bg-white p-6 rounded-lg shadow-lg text-center transform hover:-translate-y-2 transition-transform duration-300">
        <div className="flex justify-center items-center mb-4 text-brand-teal">
            {icon}
        </div>
        <h3 className="text-xl font-semibold text-brand-blue mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);

const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);


const HomePage = () => {
    const conditions = ["Knee & Hip Arthritis", "Sports Injuries", "Fracture Care", "Shoulder & Rotator Cuff", "Back & Spine Conditions", "Hand & Wrist Pain"];
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            question: "What conditions do you specialize in?",
            answer: "Dr. Collins specializes in a wide range of orthopaedic conditions, including knee and hip arthritis, sports injuries, fracture care, shoulder and rotator cuff problems, and issues related to the back, spine, hand, and wrist."
        },
        {
            question: "Do I need a referral to book an appointment?",
            answer: "While a referral from a General Practitioner or physiotherapist is helpful, it is not required. You can book a consultation directly through our website at your convenience."
        },
        {
            question: "What should I bring to my first appointment?",
            answer: "For your first appointment, please bring any previous imaging (X-rays, MRIs), a list of your current medications, your insurance information, and a valid ID. For video consultations, you can upload these documents beforehand."
        },
        {
            question: "How does a telemedicine (video) consultation work?",
            answer: "A telemedicine visit is a secure video call with Dr. Collins using your smartphone, tablet, or computer. After booking, you'll receive a link to join the call at your scheduled time. It's a convenient way to receive expert advice without traveling to the clinic."
        },
        {
            question: "What are your clinic's operating hours?",
            answer: "Our standard clinic hours are Monday to Friday, from 9:00 AM to 5:00 PM (Africa/Lagos time). Please check the booking page for real-time availability for both in-person and video consultations."
        }
    ];

    return (
        <div>
            {/* Hero Section */}
            <section className="bg-brand-teal-light text-center py-20 md:py-32">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl md:text-6xl font-bold text-brand-blue-dark mb-4">Expert Orthopaedic Care in Lagos</h1>
                    <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-3xl mx-auto">Dr. Collins provides compassionate, world-class care to help you move without pain and get back to the life you love.</p>
                    <Link to="/book" className="bg-brand-teal hover:bg-opacity-90 text-white font-bold py-3 px-8 rounded-lg shadow-lg text-lg transition duration-300 transform hover:scale-105">
                        Book Your Consultation
                    </Link>
                </div>
            </section>

            {/* About Section */}
            <section className="py-20">
                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <img src="https://picsum.photos/id/1005/600/400" alt="Dr. Collins" className="rounded-lg shadow-2xl" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-brand-blue mb-4">Meet Dr. Adekunle Collins</h2>
                        <p className="text-gray-600 mb-4">
                            A board-certified orthopaedic surgeon with over 15 years of experience, Dr. Collins specializes in minimally invasive surgery and advanced non-operative treatments. He is dedicated to providing personalized care plans that prioritize patient well-being and long-term health.
                        </p>
                        <p className="text-gray-600">
                            His practice is built on a foundation of trust, expertise, and a commitment to leveraging the latest medical advancements for better patient outcomes.
                        </p>
                    </div>
                </div>
            </section>
            
            {/* Conditions Treated Section */}
            <section className="bg-brand-gray py-20">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-brand-blue mb-2">Conditions We Treat</h2>
                    <p className="text-gray-600 mb-12 max-w-2xl mx-auto">We offer comprehensive care for a wide range of musculoskeletal conditions.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {conditions.map(condition => (
                            <span key={condition} className="bg-brand-teal-light text-brand-teal font-semibold py-2 px-4 rounded-full">
                                {condition}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-20">
                 <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                         <h2 className="text-3xl font-bold text-brand-blue mb-2">Our Services</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">From convenient video consults to in-person examinations, we're here for you.</p>
                    </div>
                     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                         <FeatureCard title="Telemedicine Consults" description="Secure, convenient video appointments from the comfort of your home." icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>} />
                         <FeatureCard title="In-Person Exams" description="Comprehensive physical examinations and assessments at our state-of-the-art clinic." icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>} />
                         <FeatureCard title="Pre-Surgical Planning" description="Detailed consultations to prepare you for your procedure and answer all your questions." icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>} />
                     </div>
                 </div>
            </section>

            {/* FAQ Section */}
            <section className="bg-brand-gray py-20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-brand-blue mb-2">Frequently Asked Questions</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Find answers to common questions about our practice and services.</p>
                    </div>
                    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg border border-gray-200">
                        {faqs.map((faq, index) => (
                            <div key={index} className={`border-b border-gray-200 last:border-b-0`}>
                                <button
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    className="w-full flex justify-between items-center text-left p-6 hover:bg-brand-teal-light focus:outline-none transition-colors duration-200"
                                    aria-expanded={openFaq === index}
                                >
                                    <span className="text-lg font-semibold text-brand-blue-dark">{faq.question}</span>
                                    <ChevronDownIcon className={`w-6 h-6 text-brand-teal transform transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`} />
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-500 ease-in-out ${openFaq === index ? 'max-h-96' : 'max-h-0'}`}
                                >
                                    <div className="p-6 pt-0 text-gray-700">
                                        <p>{faq.answer}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
};

export default HomePage;
