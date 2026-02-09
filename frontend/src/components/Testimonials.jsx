import React from 'react';
import { useContent } from '../context/ContentContext';
import { Star, Quote } from 'lucide-react';

export default function Testimonials() {
  const { content, testimonials, loading } = useContent();

  if (loading || !content) {
    return (
      <section id="testimonials" className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-dark-100 rounded w-1/4 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  // If no testimonials, don't render section
  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className="section-padding bg-gradient-to-b from-white to-dark-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-electric-blue-100 text-electric-blue-700 text-sm font-medium rounded-full mb-4">
            {content.testimonials_label || 'Testimonials'}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark-900 mb-4">
            {content.testimonials_headline || 'What Clients Say'}
          </h2>
          <p className="text-dark-500 max-w-2xl mx-auto">
            {content.testimonials_description || "Don't just take my word for it."}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="relative bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Quote icon */}
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-teal-500 to-electric-blue-500 rounded-full flex items-center justify-center">
                <Quote size={18} className="text-white" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < testimonial.rating ? 'text-coral-400 fill-coral-400' : 'text-dark-200'}
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-dark-600 leading-relaxed mb-6 italic">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                {testimonial.image_url ? (
                  <img
                    src={testimonial.image_url}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-electric-blue-500 flex items-center justify-center">
                    <span className="text-white font-bold">{testimonial.author[0]}</span>
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-dark-900">{testimonial.author}</h4>
                  <p className="text-sm text-dark-500">
                    {testimonial.role}{testimonial.company && ` at ${testimonial.company}`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
