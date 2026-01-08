import { useState, useEffect } from 'react';
import { Shuffle, X, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { didYouKnowFacts, onThisDayEvents } from '@/data/facts';

export default function DiscoveryWidget({ onRandomDiscover, onQuizOpen }) {
  const [currentFact, setCurrentFact] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [factType, setFactType] = useState('did-you-know');

  useEffect(() => {
    // Get "On This Day" event for current date
    const today = new Date();
    const todayEvent = onThisDayEvents.find(
      (event) => event.month === today.getMonth() + 1 && event.day === today.getDate()
    );

    // Rotate between "Did You Know" and "On This Day"
    const rotateFacts = () => {
      if (factType === 'did-you-know') {
        const randomFact = didYouKnowFacts[Math.floor(Math.random() * didYouKnowFacts.length)];
        setCurrentFact({ type: 'did-you-know', content: randomFact.fact });
        setFactType('on-this-day');
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
        setFactType('did-you-know');
      }
    };

    // Initial fact
    rotateFacts();

    // Rotate every 10 seconds
    const interval = setInterval(rotateFacts, 10000);

    return () => clearInterval(interval);
  }, [factType]);

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-40 md:right-6 md:bottom-6 left-1/2 md:left-auto transform -translate-x-1/2 md:translate-x-0">
        <Button
          onClick={() => setIsMinimized(false)}
          className="rounded-full w-14 h-14 bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg"
          size="icon"
        >
          🦤
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-sm md:right-6 md:bottom-6 left-1/2 md:left-auto transform -translate-x-1/2 md:translate-x-0">
      <div className="bg-card/95 backdrop-blur-md border border-border/50 rounded-lg shadow-xl p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🦤</span>
            <span
              className="text-sm uppercase tracking-wide font-bold text-primary"
              style={{ fontFamily: 'Bebas Neue, sans-serif' }}
            >
              {currentFact?.type === 'did-you-know' ? 'Did You Know?' : 'On This Day'}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full"
            onClick={() => setIsMinimized(true)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Fact Content */}
        <div className="text-sm text-foreground leading-relaxed min-h-[60px] flex items-center">
          {currentFact?.content}
        </div>

        {currentFact?.source && (
          <div className="text-xs text-muted-foreground">
            <em>Source: {currentFact.source}</em>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-border/30">
          <Button
            onClick={onRandomDiscover}
            size="sm"
            variant="outline"
            className="flex-1 text-xs border-secondary/50 hover:bg-secondary/10"
          >
            <Shuffle className="w-3 h-3 mr-1" />
            Discover
          </Button>
          <Button
            onClick={onQuizOpen}
            size="sm"
            variant="outline"
            className="flex-1 text-xs border-primary/50 hover:bg-primary/10"
          >
            <Brain className="w-3 h-3 mr-1" />
            Quiz
          </Button>
        </div>
      </div>
    </div>
  );
}
