import React from 'react';
import { useContent } from '../context/ContentContext';
import { Clock } from 'lucide-react';

export default function SectionWrapper({ sectionKey, children }) {
  const { sectionVisibility } = useContent();
  
  const isVisible = sectionVisibility[sectionKey] !== false;
  
  if (isVisible) {
    return <>{children}</>;
  }
  
  // Hidden section - show blurred version with "coming soon" message
  return (
    <div className="relative">
      {/* Blurred content */}
      <div className="blur-sm pointer-events-none select-none opacity-50">
        {children}
      </div>
      
      {/* Overlay with message */}
      <div className="absolute inset-0 flex items-center justify-center bg-dark-900/60 backdrop-blur-[2px]">
        <div className="text-center px-6 py-8 bg-dark-800/90 border border-dark-700 rounded-2xl shadow-2xl max-w-md mx-4">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-500/20 to-coral-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock size={32} className="text-teal-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Coming Soon</h3>
          <p className="text-dark-400">
            This section is currently being updated. Check back soon for exciting new content!
          </p>
        </div>
      </div>
    </div>
  );
}
