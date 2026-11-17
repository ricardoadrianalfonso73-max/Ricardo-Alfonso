import { useState } from 'react';
import { Smartphone } from 'lucide-react';

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export function SmartImage({
  src,
  alt,
  className = '',
  fallbackTitle,
}: SmartImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#101010] via-[#151515] to-[#08150D] text-[#8E9B92] border border-[#00FF55]/15 ${className}`}
        role="img"
        aria-label={alt}
      >
        <Smartphone className="w-8 h-8 text-[#00FF55]/70 mb-2" strokeWidth={1.5} />
        <span className="text-xs font-medium text-center px-4 text-[#C6D1CA]">
          {fallbackTitle || alt}
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
