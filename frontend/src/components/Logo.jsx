import React from 'react';

// SVG Logo components matching the teal/coral/electric-blue/black theme
// These are vector-based and look crisp at any size

export function LogoHorizontal({ className = "h-12" }) {
  return (
    <svg className={className} viewBox="0 0 280 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradientKAP" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#14b8a6" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>
      
      {/* K */}
      <path d="M8 16V64H18V44L38 64H52L28 40L50 16H36L18 36V16H8Z" fill="url(#gradientKAP)" />
      
      {/* A */}
      <path d="M72 64H82L86 52H106L110 64H120L98 16H88L66 64H72ZM90 42L96 26L102 42H90Z" fill="url(#gradientKAP)" />
      
      {/* P */}
      <path d="M130 16V64H140V48H156C168 48 176 40 176 32C176 24 168 16 156 16H130ZM140 26H154C160 26 164 28 164 32C164 36 160 38 154 38H140V26Z" fill="url(#gradientKAP)" />
      
      {/* Divider line */}
      <rect x="190" y="20" width="2" height="40" fill="#14b8a6" opacity="0.5" />
      
      {/* Text: Kent Angelo Prestin */}
      <text x="202" y="35" fontFamily="Inter, sans-serif" fontSize="14" fontWeight="600" fill="#1a1a1a">
        Kent Angelo Prestin
      </text>
      <text x="202" y="52" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="400" fill="#71717a">
        Web Development
      </text>
    </svg>
  );
}

export function LogoSquare({ className = "w-20 h-20", showText = false }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradientBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#14b8a6" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
        <linearGradient id="gradientBgSubtle" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      
      {/* Background with gradient */}
      <rect x="4" y="4" width="120" height="120" rx="24" fill="url(#gradientBg)" />
      
      {/* Inner background */}
      <rect x="8" y="8" width="112" height="112" rx="20" fill="#0a0a0a" />
      
      {/* Code brackets */}
      <path d="M36 44L24 64L36 84" stroke="#14b8a6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
      <path d="M92 44L104 64L92 84" stroke="#f97316" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
      
      {/* K letter */}
      <path d="M52 48V80H58V66L72 80H80L62 64L78 48H70L58 60V48H52Z" fill="white" />
      
      {showText && (
        <>
          <text x="64" y="100" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="600" fill="white" opacity="0.8">
            KAP
          </text>
        </>
      )}
    </svg>
  );
}

export function LogoIcon({ className = "w-8 h-8" }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradientIcon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#14b8a6" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>
      
      {/* Background */}
      <rect x="2" y="2" width="60" height="60" rx="14" fill="url(#gradientIcon)" />
      <rect x="4" y="4" width="56" height="56" rx="12" fill="#0a0a0a" />
      
      {/* Code brackets */}
      <path d="M18 22L10 32L18 42" stroke="#14b8a6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
      <path d="M46 22L54 32L46 42" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
      
      {/* K */}
      <path d="M26 24V40H30V33L38 40H44L33 32L43 24H37L30 30V24H26Z" fill="white" />
    </svg>
  );
}

// Simple text-based logo for navbar (light background)
export function LogoNavbar({ className = "h-10" }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoIcon className="w-10 h-10" />
      <div className="hidden sm:block">
        <div className="text-lg font-bold bg-gradient-to-r from-teal-600 via-electric-blue-600 to-coral-500 bg-clip-text text-transparent">
          Kent Angelo Prestin
        </div>
        <div className="text-xs text-dark-400 -mt-0.5">Web Development</div>
      </div>
    </div>
  );
}

// Footer version (dark background)
export function LogoFooter({ className = "h-10" }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoIcon className="w-10 h-10" />
      <div className="hidden sm:block">
        <div className="text-lg font-bold bg-gradient-to-r from-teal-400 via-electric-blue-400 to-coral-400 bg-clip-text text-transparent">
          Kent Angelo Prestin
        </div>
        <div className="text-xs text-dark-500 -mt-0.5">Web Development</div>
      </div>
    </div>
  );
}

export default { LogoHorizontal, LogoSquare, LogoIcon, LogoNavbar, LogoFooter };
