import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { ChatbotInterface } from './components/ChatbotInterface';
import { PricingPage } from './components/PricingPage';
import { AdminDashboard } from './components/AdminDashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'chatbot' | 'pricing' | 'admin'>('landing');

  const handleNavigate = (page: string) => {
    setCurrentPage(page as 'landing' | 'chatbot' | 'pricing' | 'admin');
  };

  return (
    <div className="size-full">
      {currentPage === 'landing' && <LandingPage onNavigate={handleNavigate} />}
      {currentPage === 'chatbot' && <ChatbotInterface onNavigate={handleNavigate} />}
      {currentPage === 'pricing' && <PricingPage onNavigate={handleNavigate} />}
      {currentPage === 'admin' && <AdminDashboard onNavigate={handleNavigate} />}
    </div>
  );
}
