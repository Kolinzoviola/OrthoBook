
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import ConfirmationPage from './pages/ConfirmationPage';
import AdminPage from './pages/AdminPage';
import TelemedicinePage from './pages/TelemedicinePage';
import { BookingProvider } from './context/BookingContext';
import ReminderScheduler from './components/ReminderScheduler';

function App() {
  return (
    <BookingProvider>
      <HashRouter>
        <ReminderScheduler />
        <div className="flex flex-col min-h-screen bg-white">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/book" element={<BookingPage />} />
              <Route path="/confirmation" element={<ConfirmationPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/visit/:id" element={<TelemedicinePage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </BookingProvider>
  );
}

export default App;