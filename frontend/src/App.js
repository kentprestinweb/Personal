import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ContentProvider } from './context/ContentContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import SectionWrapper from './components/SectionWrapper';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import ExcelCleaner from './components/ExcelCleaner';
import './App.css';

function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SectionWrapper sectionKey="about">
          <About />
        </SectionWrapper>
        <SectionWrapper sectionKey="services">
          <Services />
        </SectionWrapper>
        <SectionWrapper sectionKey="portfolio">
          <Portfolio />
        </SectionWrapper>
        <SectionWrapper sectionKey="testimonials">
          <Testimonials />
        </SectionWrapper>
        <SectionWrapper sectionKey="contact">
          <Contact />
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <ContentProvider>
      <Router>
        <div className="min-h-screen bg-white dark:bg-dark-950">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/tools/excel-cleaner" element={<ExcelCleaner />} />
          </Routes>
        </div>
      </Router>
    </ContentProvider>
  );
}

export default App;
