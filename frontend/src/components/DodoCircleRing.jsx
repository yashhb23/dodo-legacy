export default function DodoCircleRing() {
  // Create array of 40 icons for the circle
  const iconCount = 40;
  const icons = Array.from({ length: iconCount }, (_, i) => i);

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] max-w-[1800px] aspect-square pointer-events-none">
      <div className="relative w-full h-full animate-rotate" style={{ animationDuration: '120s' }}>
        {icons.map((index) => {
          const angle = (index * 360) / iconCount;
          const radius = 45; // percentage from center
          const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
          const y = 50 + radius * Math.sin((angle * Math.PI) / 180);

          return (
            <div
              key={index}
              className="absolute w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
                opacity: 0.6,
              }}
            >
              <div
                className="w-full h-full rounded-full flex items-center justify-center"
                style={{
                  background: 'radial-gradient(circle, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)',
                  boxShadow: '0 0 20px hsl(var(--primary) / 0.5)',
                }}
              >
                <span className="text-xl md:text-2xl">🦤</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
