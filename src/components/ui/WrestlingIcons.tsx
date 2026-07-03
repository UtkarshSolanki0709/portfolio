import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  glowColor?: string;
  accentColor?: string;
}

export function ChampionshipBeltSVG({ glowColor = 'var(--gold, #D4AF37)', accentColor, className = '', ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 60"
      className={className}
      {...props}
    >
      <defs>
        <radialGradient id="belt-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={glowColor} stopOpacity="0.8" />
          <stop offset="100%" stopColor={glowColor} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF7D6" />
          <stop offset="40%" stopColor="#D4AF37" />
          <stop offset="60%" stopColor="#AA8529" />
          <stop offset="100%" stopColor="#D4AF37" />
        </linearGradient>
      </defs>
      
      {/* Background Glow */}
      <circle cx="60" cy="30" r="28" fill="url(#belt-glow)" opacity="0.6" />
      
      {/* Black Leather Strap */}
      <path d="M5,22 L115,22 L110,38 L10,38 Z" fill="#1A1A1A" stroke="#000" strokeWidth="2" />
      <path d="M5,20 L115,20 L115,22 L5,22 Z" fill="#333" />
      <path d="M10,38 L110,38 L110,40 L10,40 Z" fill="#0A0A0A" />

      {/* Strap Studs */}
      <circle cx="15" cy="30" r="1.5" fill="#555" />
      <circle cx="25" cy="30" r="1.5" fill="#555" />
      <circle cx="95" cy="30" r="1.5" fill="#555" />
      <circle cx="105" cy="30" r="1.5" fill="#555" />

      {/* Side Plates */}
      <polygon points="35,15 45,15 48,30 45,45 35,45 32,30" fill="url(#gold-gradient)" stroke="#4A3B00" strokeWidth="1" />
      <polygon points="85,15 75,15 72,30 75,45 85,45 88,30" fill="url(#gold-gradient)" stroke="#4A3B00" strokeWidth="1" />

      {/* Main Center Plate */}
      <ellipse cx="60" cy="30" rx="18" ry="22" fill="url(#gold-gradient)" stroke="#5A4700" strokeWidth="2" />
      <ellipse cx="60" cy="30" rx="15" ry="19" fill="none" stroke="#FFF7D6" strokeWidth="0.5" opacity="0.5" />
      
      {/* Red Rubies */}
      <circle cx="60" cy="12" r="1.5" fill="#FF1744" />
      <circle cx="60" cy="48" r="1.5" fill="#FF1744" />
      <circle cx="46" cy="30" r="1.5" fill="#FF1744" />
      <circle cx="74" cy="30" r="1.5" fill="#FF1744" />

      {/* Center Engraving Placeholder */}
      <path d="M53,27 L67,27 L63,33 L57,33 Z" fill="#4A3B00" opacity="0.8" />
    </svg>
  );
}

export function RingSVG({ accentColor = 'var(--red-accent, #FF1744)', glowColor, className = '', ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="mat-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#EFEFEF" />
          <stop offset="100%" stopColor="#C0C0C0" />
        </linearGradient>
        <linearGradient id="ramp-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#DDEEFF" />
        </linearGradient>
      </defs>

      {/* Entrance Ramp (White, coming from the back) */}
      <polygon points="40,0 60,0 68,26 32,26" fill="url(#ramp-gradient)" stroke="#888" strokeWidth="1" />
      <line x1="42" y1="0" x2="34" y2="26" stroke={accentColor} strokeWidth="0.8" />
      <line x1="58" y1="0" x2="66" y2="26" stroke={accentColor} strokeWidth="0.8" />

      {/* Outer Dropoff/Apron */}
      <polygon points="10,25 90,25 100,85 0,85" fill="#111" />
      <polygon points="10,25 90,25 90,30 10,30" fill="#222" /> {/* Apron lip */}
      
      {/* Mat Floor (Lighter mat to contrast ropes/posts) */}
      <polygon points="20,30 80,30 90,80 10,80" fill="url(#mat-gradient)" stroke="#555" strokeWidth="1" />

      {/* Center Logo Placeholder */}
      <g transform="translate(50, 55) scale(0.8)">
        {/* Diamond logo at center of mat */}
        <polygon points="0,-15 15,0 0,15 -15,0" fill="#222" stroke={accentColor} strokeWidth="2" />
        <path d="M-5,-5 L-10,0 L-5,5 M5,-5 L10,0 L5,5" fill="none" stroke="var(--gold, #D4AF37)" strokeWidth="1.5" />
        <line x1="-3" y1="-7" x2="3" y2="7" stroke="#FFF" strokeWidth="1.5" />
      </g>

      {/* ---------------- 4 CORNER POSTS ---------------- */}
      {/* Top Left */}
      <rect x="18" y="16" width="4" height="15" fill="#444" />
      {/* Top Right */}
      <rect x="78" y="16" width="4" height="15" fill="#444" />
      {/* Bottom Left */}
      <rect x="6" y="55" width="6" height="26" fill="#444" />
      {/* Bottom Right */}
      <rect x="88" y="55" width="6" height="26" fill="#444" />

      {/* ---------------- 3 ROPES ---------------- */}
      {/* Back Ropes (3 tiers) */}
      <line x1="20" y1="18" x2="80" y2="18" stroke={accentColor} strokeWidth="1" opacity="0.7" />
      <line x1="20" y1="22" x2="80" y2="22" stroke={accentColor} strokeWidth="1" opacity="0.7" />
      <line x1="20" y1="26" x2="80" y2="26" stroke={accentColor} strokeWidth="1" opacity="0.7" />
      
      {/* Side Ropes - Left (3 tiers) */}
      <line x1="20" y1="18" x2="8" y2="58" stroke={accentColor} strokeWidth="1.2" opacity="0.85" />
      <line x1="20" y1="22" x2="8" y2="64" stroke={accentColor} strokeWidth="1.2" opacity="0.85" />
      <line x1="20" y1="26" x2="8" y2="70" stroke={accentColor} strokeWidth="1.2" opacity="0.85" />
      
      {/* Side Ropes - Right (3 tiers) */}
      <line x1="80" y1="18" x2="92" y2="58" stroke={accentColor} strokeWidth="1.2" opacity="0.85" />
      <line x1="80" y1="22" x2="92" y2="64" stroke={accentColor} strokeWidth="1.2" opacity="0.85" />
      <line x1="80" y1="26" x2="92" y2="70" stroke={accentColor} strokeWidth="1.2" opacity="0.85" />

      {/* Front Ropes (3 tiers) */}
      <line x1="8" y1="58" x2="92" y2="58" stroke={accentColor} strokeWidth="2.5" />
      <line x1="8" y1="64" x2="92" y2="64" stroke={accentColor} strokeWidth="2.5" />
      <line x1="8" y1="70" x2="92" y2="70" stroke={accentColor} strokeWidth="2.5" />

      {/* ---------------- 3 TURNBUCKLES PER CORNER ---------------- */}
      {/* Back Left Corner (3 pads) */}
      <rect x="19" y="17" width="2" height="2" fill="#111" />
      <rect x="19" y="21" width="2" height="2" fill="#111" />
      <rect x="19" y="25" width="2" height="2" fill="#111" />

      {/* Back Right Corner (3 pads) */}
      <rect x="79" y="17" width="2" height="2" fill="#111" />
      <rect x="79" y="21" width="2" height="2" fill="#111" />
      <rect x="79" y="25" width="2" height="2" fill="#111" />

      {/* Front Left Corner (3 pads) */}
      <rect x="8" y="56" width="3" height="4" fill="#111" rx="1" />
      <rect x="8" y="62" width="3" height="4" fill="#111" rx="1" />
      <rect x="8" y="68" width="3" height="4" fill="#111" rx="1" />

      {/* Front Right Corner (3 pads) */}
      <rect x="89" y="56" width="3" height="4" fill="#111" rx="1" />
      <rect x="89" y="62" width="3" height="4" fill="#111" rx="1" />
      <rect x="89" y="68" width="3" height="4" fill="#111" rx="1" />
    </svg>
  );
}

export function AvatarSlamSVG({ className = '', glowColor, accentColor, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="avatar-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1A1A24" />
          <stop offset="100%" stopColor="#0A0A0F" />
        </linearGradient>
      </defs>
      
      {/* Base Diamond Shield */}
      <polygon points="50,5 95,50 50,95 5,50" fill="url(#avatar-bg)" stroke="var(--cyan, #00E5FF)" strokeWidth="3" />
      
      {/* Inner Accent */}
      <polygon points="50,15 85,50 50,85 15,50" fill="none" stroke="var(--cyan, #00E5FF)" strokeWidth="1" opacity="0.4" strokeDasharray="4 4" />

      {/* Code Brackets Stylized like Wrestling Lightning/Claws */}
      <path d="M35,35 L20,50 L35,65" fill="none" stroke="var(--gold, #D4AF37)" strokeWidth="4" strokeLinecap="square" />
      <path d="M65,35 L80,50 L65,65" fill="none" stroke="var(--gold, #D4AF37)" strokeWidth="4" strokeLinecap="square" />
      
      {/* Central SLASH (resembling a slash command or a sword) */}
      <path d="M55,30 L45,70" fill="none" stroke="var(--text-primary, #FFFFFF)" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

export function CertificatePlaqueSVG({ glowColor = 'var(--gold, #D4AF37)', className = '', ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 60"
      className={className}
      {...props}
    >
      <defs>
        <radialGradient id="plaque-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={glowColor} stopOpacity="0.8" />
          <stop offset="100%" stopColor={glowColor} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="metal-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF7D6" />
          <stop offset="40%" stopColor="#D4AF37" />
          <stop offset="60%" stopColor="#AA8529" />
          <stop offset="100%" stopColor="#D4AF37" />
        </linearGradient>
      </defs>

      {/* Background Glow */}
      <circle cx="60" cy="30" r="28" fill="url(#plaque-glow)" opacity="0.6" />

      {/* Plaque Base Plate */}
      <rect x="25" y="10" width="70" height="40" rx="3" fill="#1A1A1A" stroke="#000" strokeWidth="2" />

      {/* Gold Inner Plaque */}
      <rect x="29" y="14" width="62" height="32" rx="2" fill="url(#metal-gradient)" stroke="#5A4700" strokeWidth="1" />

      {/* Rivets/Studs in Corners */}
      <circle cx="32" cy="17" r="1" fill="#4A3B00" />
      <circle cx="88" cy="17" r="1" fill="#4A3B00" />
      <circle cx="32" cy="43" r="1" fill="#4A3B00" />
      <circle cx="88" cy="43" r="1" fill="#4A3B00" />

      {/* Stylized Star and Ribbon inside the Plaque */}
      <polygon points="60,20 63,26 70,27 65,32 66,39 60,35 54,39 55,32 50,27 57,26" fill="#1A1A1A" stroke="#5A4700" strokeWidth="0.5" />
      <path d="M56,36 L52,43 L56,41 L60,43 L60,36" fill="#FF1744" opacity="0.85" />
      <path d="M64,36 L68,43 L64,41 L60,43 L60,36" fill="#FF1744" opacity="0.85" />

      {/* Text lines/decorations */}
      <line x1="38" y1="22" x2="48" y2="22" stroke="#4A3B00" strokeWidth="1" opacity="0.7" />
      <line x1="38" y1="26" x2="48" y2="26" stroke="#4A3B00" strokeWidth="1" opacity="0.7" />
      <line x1="72" y1="22" x2="82" y2="22" stroke="#4A3B00" strokeWidth="1" opacity="0.7" />
      <line x1="72" y1="26" x2="82" y2="26" stroke="#4A3B00" strokeWidth="1" opacity="0.7" />
    </svg>
  );
}

