import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * TopBanner — a purposeful, rotating announcement bar.
 *
 * Research on announcement bars (Userpilot, EaseNotify, Elfsight): rotate the
 * messaging to beat "banner blindness", keep each message specific and
 * value-led, and make the whole strip clickable (2-3x more engagement than a
 * small button). So instead of one static slogan, this cycles through teasers
 * that each point at a real section and scroll the visitor there on click.
 *
 * Controlled by LandingPage (isVisible/onClose) so the Navigation can offset
 * itself by exactly this bar's 40px height. Honors reduced-motion by holding a
 * single message instead of rotating.
 */
const MESSAGES = [
  {
    text: '🇲🇺 From a sunken microcontinent to today: explore 16 moments that made Mauritius',
    target: 'history-stack',
  },
  {
    text: '🪔 Festivals, proverbs and the Kreol soul of the island await',
    target: 'community',
  },
  {
    text: '🎶 Hear the voices of Mauritius, told by its own people',
    target: 'voices',
  },
  {
    text: '🦤 The dodo was only the beginning of the island’s story',
    target: 'history-stack',
  },
];

export default function TopBanner({ isVisible = true, onClose }) {
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState(true);

  useEffect(() => {
    if (!isVisible) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined; // hold a single message; no rotation
    }
    const id = setInterval(() => {
      // fade out, swap, fade in
      setShown(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % MESSAGES.length);
        setShown(true);
      }, 350);
    }, 5000);
    return () => clearInterval(id);
  }, [isVisible]);

  if (!isVisible) return null;

  const msg = MESSAGES[index];
  const go = () => {
    document
      .getElementById(msg.target)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="relative h-10 bg-gradient-to-r from-primary to-secondary text-white px-4 text-sm font-medium">
      <div className="max-w-7xl mx-auto h-full flex items-center">
        <button
          type="button"
          onClick={go}
          className="flex-1 h-full min-w-0 text-center hover:opacity-90 transition-opacity"
        >
          <span
            className={`inline-block max-w-full truncate align-middle transition-opacity duration-300 ${
              shown ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {msg.text}
          </span>
        </button>
        <button
          type="button"
          onClick={onClose}
          className="h-10 w-11 flex items-center justify-center hover:opacity-70 transition-opacity shrink-0"
          aria-label="Close banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
