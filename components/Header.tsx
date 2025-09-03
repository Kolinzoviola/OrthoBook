
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { MenuIcon, XIcon } from './icons';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/' },
    { name: 'Services', path: '/' },
    { name: 'Admin', path: '/admin' },
  ];
  
  const navLinkClasses = "text-gray-600 hover:text-brand-blue transition duration-300";
  const activeLinkClasses = "text-brand-blue font-semibold";

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-brand-blue">
            Collins OrthoCare
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
                 <NavLink 
                    key={link.name} 
                    to={link.path} 
                    className={({ isActive }) => isActive && link.path !== '/' ? activeLinkClasses : navLinkClasses}
                 >
                    {link.name}
                 </NavLink>
            ))}
          </nav>
          <div className="hidden md:block">
            <Link to="/book" className="bg-brand-teal hover:bg-opacity-90 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition duration-300 transform hover:scale-105">
              Book Appointment
            </Link>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-white py-4">
          <nav className="flex flex-col items-center space-y-4">
           {navLinks.map(link => (
                 <NavLink 
                    key={link.name} 
                    to={link.path} 
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) => isActive && link.path !== '/' ? activeLinkClasses : navLinkClasses}
                 >
                    {link.name}
                 </NavLink>
            ))}
            <Link to="/book" onClick={() => setIsMenuOpen(false)} className="bg-brand-teal hover:bg-opacity-90 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition duration-300">
              Book Appointment
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
