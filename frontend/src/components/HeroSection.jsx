import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DodoCircleRing from '@/components/DodoCircleRing';

const districts = [
  { name: 'PORT LOUIS', position: 'top-left' },
  { name: 'CUREPIPE', position: 'top-right' },
  { name: 'VACOAS', position: 'bottom-left' },
  { name: 'GRAND BAIE', position: 'bottom-right' },
];

export default function HeroSection({ onBadgeClick }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-20">
      {/* Background gradient spotlight */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background: 'var(--gradient-hero)',
        }}
      />
      
      {/* Red spotlight effect */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-40"
        style={{
          background: 'var(--gradient-spotlight)',
        }}
      />

      {/* Animated circle ring */}
      <DodoCircleRing />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center space-y-8">
          {/* Badges - Now Clickable */}
          <div className="flex flex-wrap items-center justify-center gap-3 animate-fade-in">
            <Badge
              onClick={() => onBadgeClick('heritage')}
              variant="secondary"
              className="px-4 py-1.5 text-xs uppercase tracking-wider bg-muted/50 backdrop-blur-sm border border-border/50 cursor-pointer hover:bg-primary/20 hover:border-primary/50 transition-all"
            >
              Heritage
            </Badge>
            <Badge
              onClick={() => onBadgeClick('island-story')}
              variant="secondary"
              className="px-4 py-1.5 text-xs uppercase tracking-wider bg-muted/50 backdrop-blur-sm border border-border/50 cursor-pointer hover:bg-secondary/20 hover:border-secondary/50 transition-all"
            >
              Island Story
            </Badge>
            <Badge
              onClick={() => onBadgeClick('extinct-icon')}
              variant="secondary"
              className="px-4 py-1.5 text-xs uppercase tracking-wider bg-muted/50 backdrop-blur-sm border border-border/50 cursor-pointer hover:bg-primary/20 hover:border-primary/50 transition-all"
            >
              Extinct Icon
            </Badge>
          </div>

          {/* District names positioned around */}
          <div className="relative">
            {/* Top districts */}
            <div className="hidden lg:flex absolute -top-20 left-0 right-0 justify-between px-12 text-lg font-semibold uppercase tracking-widest opacity-70">
              <span className="animate-fade-in" style={{ animationDelay: '0.2s', fontFamily: 'Bebas Neue, sans-serif' }}>
                {districts[0].name}
              </span>
              <span className="animate-fade-in" style={{ animationDelay: '0.3s', fontFamily: 'Bebas Neue, sans-serif' }}>
                {districts[1].name}
              </span>
            </div>

            {/* Main Title */}
            <h1
              className="hero-title text-white mb-8 animate-fade-in-up"
              style={{
                textShadow: 'var(--shadow-text)',
              }}
            >
              <span className="inline-block">
                <span className="text-white">D</span>
                <span className="text-primary">O</span>
                <span className="text-white">D</span>
                <span className="text-primary">O</span>
              </span>
              <br />
              <span className="inline-block mt-2">
                <span className="text-secondary">B</span>
                <span className="text-white">I</span>
                <span className="text-secondary">R</span>
                <span className="text-white">D</span>
              </span>
            </h1>

            {/* Bottom districts */}
            <div className="hidden lg:flex absolute -bottom-20 left-0 right-0 justify-between px-12 text-lg font-semibold uppercase tracking-widest opacity-70">
              <span className="animate-fade-in" style={{ animationDelay: '0.4s', fontFamily: 'Bebas Neue, sans-serif' }}>
                {districts[2].name}
              </span>
              <span className="animate-fade-in" style={{ animationDelay: '0.5s', fontFamily: 'Bebas Neue, sans-serif' }}>
                {districts[3].name}
              </span>
            </div>
          </div>

          {/* Dodo Bird Image */}
          <div className="relative flex items-center justify-center my-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative w-full max-w-2xl aspect-square flex items-center justify-center">
              {/* Glowing background */}
              <div
                className="absolute inset-0 rounded-full opacity-30 blur-3xl"
                style={{
                  background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)',
                }}
              />
              
              {/* Dodo Bird Image */}
              <img
                src="https://www.pictureboxblue.com/wp-content/uploads/2021/02/Edwards_Dodo-s.jpg"
                alt="Dodo Bird"
                className="relative z-10 w-full h-full object-contain drop-shadow-2xl animate-float"
                style={{
                  filter: 'drop-shadow(0 0 40px hsl(var(--primary) / 0.6))',
                }}
              />
            </div>
          </div>

          {/* Description */}
          <div className="max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 uppercase tracking-wide" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
              The Iconic Symbol of Mauritius
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              An extinct flightless bird that once roamed the paradise island. 
              The Dodo became a symbol of human-caused extinction and remains 
              an eternal emblem of Mauritius' rich natural heritage.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <Button
              size="lg"
              className="group bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300 text-base px-8 py-6"
            >
              Discover More
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="group border-2 border-primary/50 hover:border-primary hover:bg-primary/10 transition-all duration-300 text-base px-8 py-6"
            >
              <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
              Watch Story
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-foreground/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
