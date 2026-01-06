import { X } from 'lucide-react';
import { useState } from 'react';

export default function TopBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-primary to-secondary text-white py-2 px-4 text-center text-sm font-medium">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1" />
        <p className="flex-1">Discover the Legacy of Mauritius</p>
        <div className="flex-1 flex justify-end">
          <button
            onClick={() => setIsVisible(false)}
            className="hover:opacity-70 transition-opacity"
            aria-label="Close banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
