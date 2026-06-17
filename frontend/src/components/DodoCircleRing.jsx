// Inline SVG dodo silhouette — renders on ALL devices including old Android/Windows
// that do not support the 🦤 emoji (added Emoji 13.0, Sept 2020, not available on older OS).
function DodoSVG({ size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Body */}
      <ellipse cx="32" cy="40" rx="18" ry="15" fill="white" fillOpacity="0.9" />
      {/* Head */}
      <circle cx="44" cy="22" r="10" fill="white" fillOpacity="0.9" />
      {/* Beak */}
      <path d="M53 20 L61 22 L53 25 Z" fill="#f0a050" />
      {/* Eye */}
      <circle cx="47" cy="20" r="2" fill="#1a1a2e" />
      {/* Tail feathers */}
      <path d="M14 38 C8 30 6 24 10 20 C12 28 14 34 18 38Z" fill="white" fillOpacity="0.7" />
      {/* Wing hint */}
      <ellipse cx="28" cy="38" rx="8" ry="5" fill="white" fillOpacity="0.5" />
      {/* Legs */}
      <line x1="28" y1="54" x2="26" y2="60" stroke="#f0a050" strokeWidth="2" strokeLinecap="round" />
      <line x1="36" y1="54" x2="38" y2="60" stroke="#f0a050" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function DodoCircleRing() {
  // Create array of 40 icons for the circle
  const iconCount = 40;
  const icons = Array.from({ length: iconCount }, (_, i) => i);

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full sm:w-[140%] max-w-[1800px] aspect-square pointer-events-none z-0">
      <div
        className="relative w-full h-full animate-rotate opacity-20 md:opacity-40 lg:opacity-60"
        style={{ animationDuration: '120s' }}
      >
        {icons.map((index) => {
          const angle = (index * 360) / iconCount;
          const radius = 45; // percentage from center
          const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
          const y = 50 + radius * Math.sin((angle * Math.PI) / 180);

          return (
            <div
              key={index}
              className="absolute w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div
                className="w-full h-full rounded-full flex items-center justify-center"
                style={{
                  background: 'radial-gradient(circle, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)',
                  boxShadow: '0 0 15px hsl(var(--primary) / 0.3)',
                }}
              >
                <DodoSVG size={20} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
