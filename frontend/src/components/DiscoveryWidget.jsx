import { useState, useEffect, useRef } from 'react';
import { Shuffle, X, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { didYouKnowFacts, onThisDayEvents } from '@/data/facts';

export default function DiscoveryWidget({ onRandomDiscover, onQuizOpen }) {
  const [currentFact, setCurrentFact] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const factTypeRef = useRef('did-you-know');
  const initializedRef = useRef(false);

  useEffect(() => {
    // Prevent double initialization in React strict mode
    if (initializedRef.current) return;
    initializedRef.current = true;

    // Get "On This Day" event for current date
    const today = new Date();
    const todayEvent = onThisDayEvents.find(
      (event) => event.month === today.getMonth() + 1 && event.day === today.getDate()
    );

    // Rotate between "Did You Know" and "On This Day"
    const rotateFacts = () => {
      if (factTypeRef.current === 'did-you-know') {
        const randomFact = didYouKnowFacts[Math.floor(Math.random() * didYouKnowFacts.length)];
        setCurrentFact({ type: 'did-you-know', content: randomFact.fact });
        factTypeRef.current = 'on-this-day';
      } else {
        if (todayEvent) {
          setCurrentFact({ type: 'on-this-day', content: todayEvent.event, source: todayEvent.source });
        } else {
          // Fallback to random event if no event today
          const randomEvent = onThisDayEvents[Math.floor(Math.random() * onThisDayEvents.length)];
          setCurrentFact({
            type: 'on-this-day',
            content: `${randomEvent.month}/${randomEvent.day}: ${randomEvent.event}`,
            source: randomEvent.source,
          });
        }
        factTypeRef.current = 'did-you-know';
      }
    };

    // Initial fact
    rotateFacts();

    // Rotate every 10 seconds
    const interval = setInterval(rotateFacts, 10000);

    return () => clearInterval(interval);
  }, []); // Empty dependency array - runs once

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-40 md:bottom-6 md:right-6">
        <Button
          onClick={() => setIsMinimized(false)}
          className="rounded-full w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg"
          size="icon"
        >
          🦤
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 w-[calc(100vw-2rem)] max-w-[320px] md:w-auto md:max-w-sm md:bottom-6 md:right-6">
      <div className="bg-card/95 backdrop-blur-md border border-border/50 rounded-lg shadow-xl p-3 md:p-4 space-y-2 md:space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl md:text-2xl">🦤</span>
            <span
              className="text-xs md:text-sm uppercase tracking-wide font-bold text-primary"
              style={{ fontFamily: 'Bebas Neue, sans-serif' }}
            >
              {currentFact?.type === 'did-you-know' ? 'Did You Know?' : 'On This Day'}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 md:h-6 md:w-6 rounded-full flex-shrink-0"
            onClick={() => setIsMinimized(true)}
          >
            <X className="w-3 h-3 md:w-4 md:h-4" />
          </Button>
        </div>

        {/* Fact Content */}
        <div className="text-xs md:text-sm text-foreground leading-relaxed min-h-[50px] md:min-h-[60px] flex items-center">
          {currentFact?.content}
        </div>

        {currentFact?.source && (
          <div className="text-[10px] md:text-xs text-muted-foreground">
            <em>Source: {currentFact.source}</em>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-1 md:pt-2 border-t border-border/30">
          <Button
            onClick={onRandomDiscover}
            size="sm"
            variant="outline"
            className="flex-1 text-[10px] md:text-xs py-1 md:py-2 h-11 md:h-auto border-secondary/50 hover:bg-secondary/10"
          >
            <Shuffle className="w-3 h-3 mr-1" />
            <span className="hidden xs:inline">Discover</span>
            <span className="inline xs:hidden">Find</span>
          </Button>
          <Button
            onClick={onQuizOpen}
            size="sm"
            variant="outline"
            className="flex-1 text-[10px] md:text-xs py-1 md:py-2 h-11 md:h-auto border-primary/50 hover:bg-primary/10 hover:text-foreground hover:border-primary text-foreground"
          >
            <Brain className="w-3 h-3 mr-1 text-current" />
            Quiz
          </Button>
        </div>
      </div>
    </div>
  );
}
