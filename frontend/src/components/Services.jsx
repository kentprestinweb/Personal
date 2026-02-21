import React from 'react';
import { useContent } from '../context/ContentContext';
import { Globe, Smartphone, ShoppingCart, Settings, Code, Paintbrush, Database, Rocket, Wrench, MapPin, Search, Phone } from 'lucide-react';

const iconMap = {
  globe: Globe,
  smartphone: Smartphone,
  'shopping-cart': ShoppingCart,
  settings: Settings,
  code: Code,
  paintbrush: Paintbrush,
  database: Database,
  rocket: Rocket,
  wrench: Wrench,
  'map-pin': MapPin,
  search: Search,
  phone: Phone,
};

export default function Services() {
  const { content, services, loading } = useContent();

  if (loading || !content) {
    return (
      <section id="services" className="section-padding bg-dark-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-dark-800 rounded w-1/4 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="section-padding bg-dark-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-coral-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-teal-500/20 text-teal-400 text-sm font-medium rounded-full mb-4">
            {content.services_label || 'What I Do'}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {content.services_headline || 'Services I Offer'}
          </h2>
          <p className="text-dark-400 max-w-2xl mx-auto">
            {content.services_description || 'I provide comprehensive web development services.'}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon] || Code;
            return (
              <div
                key={service.id}
                className="group p-6 bg-dark-900/50 backdrop-blur-sm border border-dark-800 rounded-2xl hover:border-teal-500/50 transition-all duration-300 hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-electric-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-teal-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-dark-400 leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
