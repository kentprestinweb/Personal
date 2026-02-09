import React from 'react';
import { useContent } from '../context/ContentContext';
import { Code2, Palette, Zap, Award } from 'lucide-react';

export default function About() {
  const { content, skills, loading } = useContent();

  if (loading || !content) {
    return (
      <section id="about" className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-dark-100 rounded w-1/4"></div>
            <div className="h-4 bg-dark-100 rounded w-3/4"></div>
          </div>
        </div>
      </section>
    );
  }

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const features = [
    { icon: Code2, title: 'Clean Code', description: 'Writing maintainable, scalable code' },
    { icon: Palette, title: 'Modern Design', description: 'Beautiful, user-focused interfaces' },
    { icon: Zap, title: 'Performance', description: 'Fast, optimized applications' },
    { icon: Award, title: 'Quality', description: 'Attention to every detail' },
  ];

  return (
    <section id="about" className="section-padding bg-gradient-to-b from-white to-dark-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-teal-100 text-teal-700 text-sm font-medium rounded-full mb-4">
            {content.about_label || 'About Me'}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark-900 mb-4">
            {content.about_headline || 'Passionate Web Developer'}
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Bio */}
          <div className="space-y-6">
            <p className="text-lg text-dark-600 leading-relaxed">
              {content.about_bio || 'I\'m a dedicated web developer with a passion for creating beautiful, functional websites.'}
            </p>
            <p className="text-lg text-dark-600 leading-relaxed">
              {content.about_bio_2 || 'From concept to deployment, I handle every aspect of web development with care.'}
            </p>

            {/* Feature grid */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-2 bg-gradient-to-br from-teal-500 to-electric-blue-500 rounded-lg">
                    <feature.icon size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark-900">{feature.title}</h4>
                    <p className="text-sm text-dark-500">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Skills */}
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <h3 className="text-xl font-bold text-dark-900 mb-6">Skills & Technologies</h3>
            
            {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
              <div key={category}>
                <h4 className="text-sm font-medium text-dark-500 uppercase tracking-wider mb-3 capitalize">
                  {category}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {categorySkills.map((skill) => (
                    <span
                      key={skill.id}
                      className="px-4 py-2 bg-gradient-to-r from-teal-50 to-electric-blue-50 text-dark-700 text-sm font-medium rounded-full border border-teal-200 hover:border-teal-400 transition-colors"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
