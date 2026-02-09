import React from 'react';
import { useContent } from '../context/ContentContext';
import { ExternalLink, Github, Rocket, Sparkles } from 'lucide-react';

export default function Portfolio() {
  const { content, portfolio, loading } = useContent();

  if (loading || !content) {
    return (
      <section id="portfolio" className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-dark-100 rounded w-1/4 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  // Show "Coming Soon" card if there are less than 3 projects
  const showComingSoon = portfolio.length < 3;

  return (
    <section id="portfolio" className="section-padding bg-gradient-to-b from-dark-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-coral-100 text-coral-700 text-sm font-medium rounded-full mb-4">
            {content.portfolio_label || 'My Work'}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark-900 mb-4">
            {content.portfolio_headline || 'Featured Projects'}
          </h2>
          <p className="text-dark-500 max-w-2xl mx-auto">
            {content.portfolio_description || 'Here are some of my recent projects.'}
          </p>
        </div>

        {/* Portfolio Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolio.map((project, index) => (
            <div
              key={project.id}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Thumbnail */}
              <div className="relative h-56 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-electric-blue-500/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                {project.thumbnail_url ? (
                  <img
                    src={project.thumbnail_url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-teal-500 to-electric-blue-500 flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">{project.title[0]}</span>
                  </div>
                )}
                
                {/* Featured badge */}
                {project.featured && (
                  <span className="absolute top-4 right-4 px-3 py-1 bg-coral-500 text-white text-xs font-bold rounded-full z-20">
                    Featured
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-dark-900 mb-2 group-hover:text-teal-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-dark-500 text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies?.slice(0, 4).map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-dark-100 text-dark-600 text-xs rounded-md"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-3">
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-electric-blue-500 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-shadow"
                    >
                      <ExternalLink size={16} />
                      Live Demo
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 border border-dark-200 text-dark-700 text-sm font-medium rounded-lg hover:bg-dark-50 transition-colors"
                    >
                      <Github size={16} />
                      Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Coming Soon Card */}
          {showComingSoon && (
            <div className="group bg-gradient-to-br from-dark-100 to-dark-50 rounded-2xl border-2 border-dashed border-dark-200 overflow-hidden hover:border-teal-300 transition-all duration-500">
              {/* Decorative Top */}
              <div className="relative h-56 bg-gradient-to-br from-teal-500/10 via-electric-blue-500/10 to-coral-500/10 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-teal-500/20 to-electric-blue-500/20 rounded-2xl flex items-center justify-center">
                    <Rocket size={40} className="text-teal-500" />
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles size={16} className="text-coral-400" />
                    <span className="text-dark-400 text-sm font-medium">In Progress</span>
                    <Sparkles size={16} className="text-coral-400" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-dark-700 mb-2">
                  More Projects Coming Soon
                </h3>
                <p className="text-dark-400 text-sm mb-4">
                  Exciting new projects are in the works! Stay tuned for more innovative web solutions.
                </p>
                
                {/* Decorative Tags */}
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="px-3 py-1 bg-teal-100 text-teal-600 text-xs rounded-full">
                    E-Commerce
                  </span>
                  <span className="px-3 py-1 bg-electric-blue-100 text-electric-blue-600 text-xs rounded-full">
                    Web Apps
                  </span>
                  <span className="px-3 py-1 bg-coral-100 text-coral-600 text-xs rounded-full">
                    Landing Pages
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Empty state */}
        {portfolio.length === 0 && (
          <div className="text-center py-16">
            <p className="text-dark-500">No projects to display yet. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
}
