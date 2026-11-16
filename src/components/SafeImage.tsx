import { ImageOff } from 'lucide-react';
import { useState } from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export function SafeImage({ src, alt, className = '', fallbackLabel }: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#101C35] to-[#1D2D4E] text-white/80 p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <ImageOff className="w-7 h-7 text-[#C5A46D] mb-2" aria-hidden="true" />
        <span className="font-serif text-sm tracking-wide text-white/90">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
      loading="lazy"
    />
  );
}
