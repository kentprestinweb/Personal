import React from 'react';
import { useContent } from '../context/ContentContext';
import { ArrowDown, Code, Sparkles } from 'lucide-react';
import { LogoSquare } from './Logo';

export default function Hero() {
  const { content, loading } = useContent();

  const handleScrollDown = () => {
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading || !content) {
    return (
      <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-50 via-white to-teal-50">
        <div className="animate-pulse text-teal-500">Loading...</div>
      </section>
    );
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-electric-blue-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-coral-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/80 text-sm">
              <Sparkles size={16} className="text-coral-400" />
              <span>Available for freelance work</span>
            </div>

            {/* Main heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                Hi, I'm{' '}
                <span className="text-gradient">{content.hero_name?.split(' ')[0] || 'Kent'}</span>
              </h1>
              <p className="text-xl sm:text-2xl md:text-3xl text-white/80 font-light">
                {content.hero_title || 'Web Developer'}
              </p>
            </div>

            {/* Subtitle */}
            <p className="text-lg text-white/60 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {content.hero_tagline || 'I transform ideas into stunning digital experiences.'}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href={content.hero_cta_url || '#portfolio'}
                className="group px-8 py-4 bg-gradient-to-r from-teal-500 to-electric-blue-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Code size={20} />
                {content.hero_cta_text || 'View My Work'}
              </a>
              <a
                href="#contact"
                className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300 flex items-center justify-center"
              >
                Get In Touch
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 justify-center lg:justify-start pt-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{content.about_years_experience || '2+'}</p>
                <p className="text-white/60 text-sm">Years Experience</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{content.about_projects_completed || '10+'}</p>
                <p className="text-white/60 text-sm">Projects Completed</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{content.about_clients_satisfied || '5+'}</p>
                <p className="text-white/60 text-sm">Happy Clients</p>
              </div>
            </div>
          </div>

          {/* Right content - Logo/Image */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500 via-electric-blue-500 to-coral-500 rounded-3xl blur-2xl opacity-30 scale-110" />
              
              {/* Logo container */}
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl p-12">
                <img 
                  src={content.hero_image || LOGO_SQUARE} 
                  alt="Kent Angelo Prestin" 
                  className="w-64 h-64 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={handleScrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors cursor-pointer"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ArrowDown size={20} className="animate-bounce" />
        </div>
      </button>
    </section>
  );
}
