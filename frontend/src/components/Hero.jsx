import React from 'react';
import { useContent } from '../context/ContentContext';
import { ArrowDown, Zap, TrendingUp, MapPin, Phone, Wrench } from 'lucide-react';
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
            {/* Niche Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-coral-500/20 to-teal-500/20 backdrop-blur-sm border border-coral-500/30 rounded-full text-white text-sm font-medium">
              <Wrench size={16} className="text-coral-400" />
              <span>Websites for Tradies & Local Businesses</span>
            </div>

            {/* Main heading - Strong & Direct */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                {content.hero_headline || (
                  <>
                    Helping Local Businesses{' '}
                    <span className="text-gradient">Win Online</span>
                  </>
                )}
              </h1>
              <p className="text-xl sm:text-2xl md:text-3xl text-white/90 font-medium">
                {content.hero_title || 'Turn Local Searches Into Local Customers'}
              </p>
            </div>

            {/* Value Proposition */}
            <p className="text-lg text-white/70 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {content.hero_tagline || "I build high-performance websites for electricians, plumbers, and tradies who want to dominate their local area. More visibility. More calls. More growth."}
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start text-sm text-white/60">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-teal-400" />
                <span>Local Business Specialist</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-coral-400" />
                <span>Built to Rank & Convert</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href={content.hero_cta_url || '#contact'}
                className="group px-8 py-4 bg-gradient-to-r from-coral-500 to-coral-600 text-white font-bold rounded-full hover:shadow-lg hover:shadow-coral-500/25 transition-all duration-300 flex items-center justify-center gap-2 text-lg"
              >
                <Phone size={20} />
                {content.hero_cta_text || "Get Your Free Quote"}
              </a>
              <a
                href="#portfolio"
                className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Zap size={20} />
                See My Work
              </a>
            </div>

            {/* Stats - Reframed for Local Business */}
            <div className="flex flex-wrap gap-8 justify-center lg:justify-start pt-8 border-t border-white/10">
              <div className="text-center">
                <p className="text-3xl font-bold text-gradient">{content.about_projects_completed || '10+'}</p>
                <p className="text-white/60 text-sm">Local Businesses Helped</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gradient">{content.hero_stat_calls || '500+'}</p>
                <p className="text-white/60 text-sm">Customer Calls Generated</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gradient">{content.hero_stat_ranking || '#1'}</p>
                <p className="text-white/60 text-sm">Local Search Rankings</p>
              </div>
            </div>
          </div>

          {/* Right content - Logo/Image */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500 via-electric-blue-500 to-coral-500 rounded-3xl blur-2xl opacity-30 scale-110" />
              
              {/* Logo container */}
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl p-8">
                <LogoSquare className="w-64 h-64" />
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                🔥 Tradie Specialist
              </div>
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-coral-500 to-coral-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                ⚡ Fast Results
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
          <span className="text-xs uppercase tracking-widest">Learn More</span>
          <ArrowDown size={20} className="animate-bounce" />
        </div>
      </button>
    </section>
  );
}
