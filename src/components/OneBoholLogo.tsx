import React from 'react';
import Image from 'next/image';

interface OneBoholLogoProps {
  className?: string;
}

export function OneBoholLogo({ className = 'w-48' }: OneBoholLogoProps) {
  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      <Image
        src="/brand/one-bohol-logo.png"
        alt="ONE BOHOL"
        width={204}
        height={70}
        className="w-full h-auto object-contain block"
        priority
        unoptimized
      />
      {/* "FOR GOOD GOVERNANCE" matched to the exact X=3..200 (197px) width of "ONE BOHOL" above it */}
      <svg
        viewBox="0 0 204 14"
        className="w-full h-auto block mt-0.5"
        aria-label="FOR GOOD GOVERNANCE"
      >
        <text
          x="3"
          y="10.5"
          textLength="197"
          lengthAdjust="spacing"
          fill="#0B5334"
          fontSize="9.2"
          fontWeight="600"
          fontFamily="'Plus Jakarta Sans', var(--font-display), system-ui, sans-serif"
          letterSpacing="0.06em"
        >
          FOR GOOD GOVERNANCE
        </text>
      </svg>
    </div>
  );
}
