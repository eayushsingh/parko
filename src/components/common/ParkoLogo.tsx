import React from 'react';

export interface ParkoLogoProps {
  /**
   * 'full': Icon + "Parko" + "PARKING ON DEMAND"
   * 'icon': Green map pin with white P only
   */
  variant?: 'full' | 'icon';
  /**
   * 'light': Dark text for light backgrounds (Navbar, Auth, white pages)
   * 'dark': White text for dark backgrounds (Footer, dark cards)
   */
  theme?: 'light' | 'dark';
  /**
   * Size presets
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Optional custom className for container
   */
  className?: string;
  /**
   * If true, uses vector SVG; if false, uses the cropped high-DPI transparent PNG asset.
   * Defaults to 'image' for 100% pixel-accuracy to the supplied brand asset.
   */
  mode?: 'image' | 'vector';
}

/**
 * Official Parko Brand Logo Component
 * Matches the user-supplied art-directed mobility brand logo:
 * - Green map marker with solid white 'P'
 * - Modern bold 'Parko' typography
 * - 'PARKING ON DEMAND' subtext
 */
export const ParkoLogo: React.FC<ParkoLogoProps> = ({
  variant = 'full',
  theme = 'light',
  size = 'md',
  className = '',
  mode = 'image',
}) => {
  // Height presets
  const heightClasses = {
    sm: variant === 'full' ? 'h-8' : 'h-7',
    md: variant === 'full' ? 'h-9 sm:h-10' : 'h-8 sm:h-9',
    lg: variant === 'full' ? 'h-11 sm:h-12' : 'h-10 sm:h-11',
    xl: variant === 'full' ? 'h-14 sm:h-16' : 'h-12 sm:h-14',
  }[size];

  if (mode === 'image') {
    const src =
      variant === 'icon'
        ? '/images/parko-icon.png'
        : theme === 'dark'
        ? '/images/parko-logo-dark.png'
        : '/images/parko-logo.png';

    return (
      <div className={`inline-flex items-center select-none ${className}`}>
        <img
          src={src}
          alt="Parko — Parking on Demand"
          className={`${heightClasses} w-auto object-contain transition-transform duration-200 group-hover:scale-105`}
          loading="eager"
          decoding="async"
        />
      </div>
    );
  }

  // Vector SVG implementation
  if (variant === 'icon') {
    return (
      <svg
        viewBox="0 0 48 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${heightClasses} w-auto transition-transform duration-200 group-hover:scale-105 ${className}`}
        aria-label="Parko Logo"
      >
        <path
          d="M24 2C12.954 2 4 10.954 4 22C4 34.5 19.5 50.8 23.1 54.3C23.6 54.8 24.4 54.8 24.9 54.3C28.5 50.8 44 34.5 44 22C44 10.954 35.046 2 24 2Z"
          fill="#0E8345"
        />
        <path
          d="M18 13.5C18 12.67 18.67 12 19.5 12H26.5C30.64 12 34 15.36 34 19.5C34 23.64 30.64 27 26.5 27H22.5V33.5C22.5 34.33 21.83 35 21 35H19.5C18.67 35 18 34.33 18 33.5V13.5ZM22.5 16.5V22.5H26.5C28.16 22.5 29.5 21.16 29.5 19.5C29.5 17.84 28.16 16.5 26.5 16.5H22.5Z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  const textColor = theme === 'dark' ? '#FFFFFF' : '#0F172A';
  const subtextColor = theme === 'dark' ? '#E2E8F0' : '#1E293B';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Pin Icon */}
      <svg
        viewBox="0 0 48 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${heightClasses} w-auto shrink-0 transition-transform duration-200 group-hover:scale-105`}
        aria-hidden="true"
      >
        <path
          d="M24 2C12.954 2 4 10.954 4 22C4 34.5 19.5 50.8 23.1 54.3C23.6 54.8 24.4 54.8 24.9 54.3C28.5 50.8 44 34.5 44 22C44 10.954 35.046 2 24 2Z"
          fill="#0E8345"
        />
        <path
          d="M18 13.5C18 12.67 18.67 12 19.5 12H26.5C30.64 12 34 15.36 34 19.5C34 23.64 30.64 27 26.5 27H22.5V33.5C22.5 34.33 21.83 35 21 35H19.5C18.67 35 18 34.33 18 33.5V13.5ZM22.5 16.5V22.5H26.5C28.16 22.5 29.5 21.16 29.5 19.5C29.5 17.84 28.16 16.5 26.5 16.5H22.5Z"
          fill="#FFFFFF"
        />
      </svg>

      {/* Typography Stack */}
      <div className="flex flex-col justify-center">
        <span
          className="font-black tracking-tight leading-none text-2xl"
          style={{ color: textColor }}
        >
          Parko
        </span>
        <span
          className="text-[9px] font-bold tracking-[0.2em] uppercase mt-1 leading-none"
          style={{ color: subtextColor }}
        >
          Parking on Demand
        </span>
      </div>
    </div>
  );
};
