
import React from 'react';
import { PhoneIcon, MailIcon, LocationMarkerIcon } from './icons';

export const Footer = () => {
  return (
    <footer className="bg-brand-blue text-white mt-12">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Collins OrthoCare</h3>
            <p className="text-gray-300">Providing expert orthopaedic care with compassion and modern technology.</p>
            <div className="mt-4">
                <p className="font-bold text-sm text-yellow-300">Disclaimer: Not for emergencies.</p>
                <p className="text-xs text-gray-400">If you are experiencing a medical emergency, please call your local emergency services immediately.</p>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <LocationMarkerIcon className="h-5 w-5 mr-2" />
                123 Healthway, Lagos, Nigeria
              </li>
              <li className="flex items-center">
                <PhoneIcon className="h-5 w-5 mr-2" />
                +234 800 123 4567
              </li>
              <li className="flex items-center">
                <MailIcon className="h-5 w-5 mr-2" />
                contact@collinsortho.care
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white">Privacy Policy (NDPR Compliant)</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white">Telemedicine Consent</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Collins OrthoCare. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};
