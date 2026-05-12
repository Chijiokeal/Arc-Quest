import React from 'react';

export const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <svg 
      viewBox="0 0 1024 1024" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="1024" height="1024" rx="160" fill="#0D1B2A" />
      
      {/* Crown */}
      <path 
        d="M512 160L560 240L640 200L600 280L680 320H344L424 280L384 200L464 240L512 160Z" 
        stroke="white" 
        strokeWidth="20" 
        strokeLinejoin="round"
      />
      <rect x="344" y="320" width="336" height="40" stroke="white" strokeWidth="20" />
      
      {/* Stylized A */}
      <path 
        d="M200 640C200 520 300 420 420 420H440V640H200Z" 
        fill="white" 
      />
      <path 
        d="M280 640H440V580L340 580C340 580 280 580 280 640Z" 
        fill="#0D1B2A" 
      />
      
      {/* Arc Text */}
      <text 
        x="480" 
        y="620" 
        fill="white" 
        style={{ font: 'bold 240px Inter, sans-serif' }}
      >
        Arc
      </text>
      
      {/* QUEST Text */}
      <text 
        x="512" 
        y="860" 
        fill="url(#questGradient)" 
        textAnchor="middle" 
        style={{ font: 'bold 160px Inter, sans-serif', letterSpacing: '40px' }}
      >
        QUEST
      </text>
      
      <defs>
        <linearGradient id="questGradient" x1="512" y1="700" x2="512" y2="900" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E2E8F0" />
          <stop offset="1" stopColor="#94A3B8" />
        </linearGradient>
      </defs>
    </svg>
  );
};
