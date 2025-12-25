
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import PortfolioPage from './pages/PortfolioPage';
import ContactPage from './pages/ContactPage';
import CareersPage from './pages/CareersPage';
import BlogPage from './pages/BlogPage';
import CRMAuth from './crm/Auth';
import CRMDashboard from './crm/Dashboard';
import CRMInvoices from './crm/Invoices';
import CRMBlog from './crm/BlogAdmin';
import CRMProposals from './crm/Proposals';
import CRMQuotations from './crm/Quotations';
import CRMLayout from './crm/CRMLayout';
import ChatBot from './components/ChatBot';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const NotFound = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
    <h1 className="text-6xl font-black text-indigo-500 mb-4">404</h1>
    <p className="text-2xl text-gray-400 mb-8">Page not found</p>
    <a href="#/" className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold">Back to Home</a>
  </div>
);

const AppContent: React.FC<{ scrolled: boolean }> = ({ scrolled }) => {
  const location = useLocation();
  const isCRM = location.pathname.startsWith('/crm');

  return (
    <div className="min-h-screen bg-black overflow-x-hidden flex flex-col">
      {!isCRM && <Navbar scrolled={scrolled} />}
      <main className={`flex-grow ${!isCRM ? 'pt-20' : ''}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/blog" element={<BlogPage />} />

          {/* CRM Routes */}
          <Route path="/crm" element={<CRMAuth />} />
          <Route path="/crm/dashboard" element={<CRMLayout><CRMDashboard /></CRMLayout>} />
          <Route path="/crm/billing" element={<CRMLayout><CRMInvoices /></CRMLayout>} />
          <Route path="/crm/blog" element={<CRMLayout><CRMBlog /></CRMLayout>} />
          <Route path="/crm/proposals" element={<CRMLayout><CRMProposals /></CRMLayout>} />
          <Route path="/crm/quotations" element={<CRMLayout><CRMQuotations /></CRMLayout>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isCRM && <Footer />}
      <ChatBot />
    </div>
  );
};

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <AppContent scrolled={scrolled} />
    </Router>
  );
};

export default App;
