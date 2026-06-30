import { useRef, useEffect } from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const districts = [
  { name: 'PORT LOUIS', position: 'top-left' },
  { name: 'CUREPIPE', position: 'top-right' },
  { name: 'VACOAS', position: 'bottom-left' },
  { name: 'GRAND BAIE', position: 'bottom-right' },
];

export default function HeroSection({ onBadgeClick, onDiscoverClick, onWatchStory }) {
  const handleDiscoverMore = () => {
    // Scroll to heritage section
    document.getElementById('history-stack')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleWatchStory = () => {
    // Open timeline modal via callback or scroll to history
    if (onWatchStory) {
      onWatchStory();
    } else {
      document.getElementById('history-stack')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const dodoRef = useRef(null);

  // Subtle scroll parallax: the dodo drifts downward as the hero scrolls away,
  // adding depth and inviting the user onward. rAF-batched, transform-only
  // (GPU), and skipped for reduced-motion. Never drives React state.
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return undefined;
    }
    let raf = null;
    const onScroll = () => {
      if (raf != null) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const y = window.scrollY;
        if (dodoRef.current) {
          dodoRef.current.style.transform = `translate3d(0, ${y * 0.36}px, 0)`;
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf != null) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 sm:pt-32 pb-16 sm:pb-20">
      {/* Atmospheric backdrop: the island's volcanic-ocean origin. Heavily
          darkened (low opacity + the gradient on top) so the hero content
          stays legible. Purpose: ground the first screen in Mauritius's
          geological birth rather than a generic gradient. */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-70"
        style={{
          backgroundImage:
            "url('/assets/images/backgrounds/hero-volcanic.webp')",
        }}
        aria-hidden="true"
      />

      {/* Background gradient spotlight (lightened so the volcanic image below
          stays clearly visible while keeping the brand tint + text contrast). */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'var(--gradient-hero)',
        }}
      />

      {/* Centre vignette: darkens the middle so the DODO title and the bird sit
          on a calm, uncrowded field while the volcanic colour still glows at the
          edges. This is what stops the hero feeling busy/cramped. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 72% 62% at 50% 44%, rgba(8,4,8,0.78) 0%, rgba(8,4,8,0.35) 52%, transparent 78%)',
        }}
      />
      
      {/* Red spotlight effect */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] opacity-30 sm:opacity-40"
        style={{
          background: 'var(--gradient-spotlight)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center space-y-6 sm:space-y-8">
          {/* Badges - Now Clickable */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 animate-fade-in">
            <Badge
              onClick={() => onBadgeClick('heritage')}
              role="button"
              tabIndex={0}
              variant="secondary"
              className="min-h-[44px] sm:min-h-0 inline-flex items-center justify-center px-4 py-2.5 sm:px-4 sm:py-1.5 text-xs uppercase tracking-wider bg-muted/50 backdrop-blur-sm border border-border/50 cursor-pointer hover:bg-primary/20 hover:border-primary/50 transition-all"
            >
              Heritage
            </Badge>
            <Badge
              onClick={() => onBadgeClick('island-story')}
              role="button"
              tabIndex={0}
              variant="secondary"
              className="min-h-[44px] sm:min-h-0 inline-flex items-center justify-center px-4 py-2.5 sm:px-4 sm:py-1.5 text-xs uppercase tracking-wider bg-muted/50 backdrop-blur-sm border border-border/50 cursor-pointer hover:bg-secondary/20 hover:border-secondary/50 transition-all"
            >
              Island Story
            </Badge>
            <Badge
              onClick={() => onBadgeClick('extinct-icon')}
              role="button"
              tabIndex={0}
              variant="secondary"
              className="min-h-[44px] sm:min-h-0 inline-flex items-center justify-center px-4 py-2.5 sm:px-4 sm:py-1.5 text-xs uppercase tracking-wider bg-muted/50 backdrop-blur-sm border border-border/50 cursor-pointer hover:bg-primary/20 hover:border-primary/50 transition-all"
            >
              Extinct Icon
            </Badge>
          </div>

          {/* District names positioned around - hidden on mobile for cleaner look */}
          <div className="relative">
            {/* Top districts - Desktop only */}
            <div className="hidden lg:flex absolute -top-20 left-0 right-0 justify-between px-12 text-lg font-semibold uppercase tracking-widest opacity-70">
              <span className="animate-fade-in" style={{ animationDelay: '0.2s', fontFamily: 'Bebas Neue, sans-serif' }}>
                {districts[0].name}
              </span>
              <span className="animate-fade-in" style={{ animationDelay: '0.3s', fontFamily: 'Bebas Neue, sans-serif' }}>
                {districts[1].name}
              </span>
            </div>

            {/* Main Title - with better mobile text shadow */}
            <div className="bg-black/20 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none rounded-lg p-4 sm:p-0 mx-auto max-w-fit">
              <h1 className="hero-title mb-4 sm:mb-6">
                <span className="hero-reveal hero-title-wrap">
                  <span className="hero-title-base">MAURITIUS</span>
                  <span className="hero-title-flag" aria-hidden="true">MAURITIUS</span>
                </span>
              </h1>
            </div>

            {/* Purpose tagline: reveals after the title, frames the site as the
                island's whole story (not just the bird), and invites scrolling. */}
            <p
              className="animate-fade-in-up text-xs sm:text-sm md:text-base uppercase tracking-[0.3em] text-muted-foreground mb-2"
              style={{ animationDelay: '0.85s', animationFillMode: 'both' }}
            >
              One island · Every origin · One people
            </p>

            {/* Bottom districts - Desktop only */}
            <div className="hidden lg:flex absolute -bottom-20 left-0 right-0 justify-between px-12 text-lg font-semibold uppercase tracking-widest opacity-70">
              <span className="animate-fade-in" style={{ animationDelay: '0.4s', fontFamily: 'Bebas Neue, sans-serif' }}>
                {districts[2].name}
              </span>
              <span className="animate-fade-in" style={{ animationDelay: '0.5s', fontFamily: 'Bebas Neue, sans-serif' }}>
                {districts[3].name}
              </span>
            </div>
          </div>

          {/* Dodo Bird Image - Smaller on mobile */}
          <div ref={dodoRef} className="relative flex items-center justify-center my-8 sm:my-16 animate-fade-in will-change-transform" style={{ animationDelay: '0.3s' }}>
            <div className="relative w-full max-w-sm sm:max-w-lg md:max-w-2xl aspect-square flex items-center justify-center">
              {/* Glowing background */}
              <div
                className="absolute inset-0 rounded-full opacity-20 sm:opacity-30 blur-2xl sm:blur-3xl"
                style={{
                  background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)',
                }}
              />
              
              {/* Dodo Bird Image - Optimized with blur placeholder */}
              <picture>
                <source
                  type="image/webp"
                  srcSet="https://www.pictureboxblue.com/wp-content/uploads/2021/02/Edwards_Dodo-s.jpg"
                />
              <img
                src="https://www.pictureboxblue.com/wp-content/uploads/2021/02/Edwards_Dodo-s.jpg"
                alt="Historic illustration of the Dodo Bird - Mauritius national symbol"
                className="relative z-10 w-full h-full object-contain drop-shadow-2xl animate-float"
                style={{
                  filter: 'drop-shadow(0 0 30px hsl(var(--primary) / 0.5))',
                }}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                width="800"
                height="800"
              />
              </picture>
            </div>
          </div>

          {/* Description - Constrained width for readability */}
          <div className="max-w-2xl mx-auto animate-fade-in px-2" style={{ animationDelay: '0.5s' }}>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 uppercase tracking-wide" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
              The Iconic Symbol of Mauritius
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed" style={{ maxWidth: '65ch', margin: '0 auto' }}>
              The dodo (Raphus cucullatus), a flightless bird endemic to Mauritius, became extinct circa 1662-1690, less
              than a century after human arrival. Habitat destruction, hunting, and invasive species (rats, pigs, monkeys) 
              introduced by Dutch settlers caused its demise. Today, the dodo symbolizes human-caused extinction and 
              remains Mauritius' most recognizable icon, appearing on the national coat of arms.
            </p>
          </div>

          {/* CTA Buttons - Full width on mobile */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-6 sm:pt-8 animate-fade-in px-4 sm:px-0" style={{ animationDelay: '0.7s' }}>
            <Button
              size="lg"
              onClick={handleDiscoverMore}
              className="w-full sm:w-auto group bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300 text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6"
            >
              Discover More
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleWatchStory}
              className="w-full sm:w-auto group border-2 border-primary/50 hover:border-primary hover:bg-primary/10 transition-all duration-300 text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6"
            >
              <Play className="mr-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
              Watch Story
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator - hidden on very small screens */}
      <div className="hidden sm:block absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-foreground/30 rounded-full flex items-start justify-center p-1.5 sm:p-2">
          <div className="w-1 h-1.5 sm:h-2 bg-foreground/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
