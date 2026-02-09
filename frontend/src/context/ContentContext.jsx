import React, { createContext, useContext, useState, useEffect } from 'react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

const ContentContext = createContext();

export function useContent() {
  return useContext(ContentContext);
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContent = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/content`);
      if (response.ok) {
        const data = await response.json();
        setContent(data);
      }
    } catch (err) {
      console.error('Error fetching content:', err);
      setError(err.message);
    }
  };

  const fetchPortfolio = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/portfolio`);
      if (response.ok) {
        const data = await response.json();
        setPortfolio(data);
      }
    } catch (err) {
      console.error('Error fetching portfolio:', err);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/services`);
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/testimonials`);
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data);
      }
    } catch (err) {
      console.error('Error fetching testimonials:', err);
    }
  };

  const fetchSkills = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/skills`);
      if (response.ok) {
        const data = await response.json();
        setSkills(data);
      }
    } catch (err) {
      console.error('Error fetching skills:', err);
    }
  };

  const refreshAll = async () => {
    setLoading(true);
    await Promise.all([
      fetchContent(),
      fetchPortfolio(),
      fetchServices(),
      fetchTestimonials(),
      fetchSkills()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const value = {
    content,
    portfolio,
    services,
    testimonials,
    skills,
    loading,
    error,
    refreshAll,
    setContent,
    setPortfolio,
    setServices,
    setTestimonials,
    setSkills,
    BACKEND_URL
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
}
