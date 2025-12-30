
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy load components for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const CareersPage = lazy(() => import('./pages/CareersPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const AverqonBillingPage = lazy(() => import('./pages/AverqonBillingPage'));

// CRM Routes
const CRMAuth = lazy(() => import('./crm/Auth'));
const CRMDashboard = lazy(() => import('./crm/Dashboard'));
const CRMInvoices = lazy(() => import('./crm/Invoices'));
const CRMBlog = lazy(() => import('./crm/BlogAdmin'));
const CRMProposals = lazy(() => import('./crm/Proposals'));
const CRMQuotations = lazy(() => import('./crm/Quotations'));
const CRMProfile = lazy(() => import('./crm/Profile'));
const CRMTimesheets = lazy(() => import('./crm/Timesheets'));
const EmployeeManagement = lazy(() => import('./crm/EmployeeManagement'));
const CRMLayout = lazy(() => import('./crm/CRMLayout'));
const CRMMeetings = lazy(() => import('./crm/Meetings'));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const PageLoader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
  </div>
);

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
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-black overflow-x-hidden flex flex-col">
      {!isCRM && !isHome && <Navbar scrolled={scrolled} />}
      <main className={`flex-grow ${!isCRM ? 'pt-20' : ''}`}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/averqon-billing" element={<AverqonBillingPage />} />

            {/* CRM Routes */}
            <Route path="/crm" element={<CRMAuth />} />
            <Route path="/crm/dashboard" element={<CRMLayout><CRMDashboard /></CRMLayout>} />
            <Route path="/crm/profile" element={<CRMLayout><CRMProfile /></CRMLayout>} />
            <Route path="/crm/timesheets" element={<CRMLayout><CRMTimesheets /></CRMLayout>} />
            <Route path="/crm/employees" element={<CRMLayout><EmployeeManagement /></CRMLayout>} />
            <Route path="/crm/billing" element={<CRMLayout><CRMInvoices /></CRMLayout>} />
            <Route path="/crm/blog" element={<CRMLayout><CRMBlog /></CRMLayout>} />
            <Route path="/crm/proposals" element={<CRMLayout><CRMProposals /></CRMLayout>} />
            <Route path="/crm/quotations" element={<CRMLayout><CRMQuotations /></CRMLayout>} />
            <Route path="/crm/meetings" element={<CRMLayout><CRMMeetings /></CRMLayout>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      {!isCRM && <Footer />}
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
