import { X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function TimelineModal({ isOpen, onClose }) {
  const events = [
    { year: '1507', title: 'Portuguese Discovery', period: 'Discovery' },
    { year: '1598', title: 'Dutch Arrival', period: 'Dutch Era' },
    { year: '1638-1658', title: 'First Dutch Settlement', period: 'Dutch Era' },
    { year: '1664-1710', title: 'Second Dutch Period', period: 'Dutch Era' },
    { year: '1715', title: 'French Colonization', period: 'French Era' },
    { year: '1735', title: 'Port Louis Founded', period: 'French Era' },
    { year: '1810', title: 'British Conquest', period: 'British Era' },
    { year: '1835', title: 'Slavery Abolished', period: 'British Era' },
    { year: '1968', title: 'Independence', period: 'Independence' },
    { year: '1992', title: 'Republic Status', period: 'Modern Era' },
  ];

  const getEventColor = (period) => {
    if (period.includes('Dutch') || period.includes('British')) return 'secondary';
    return 'primary';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl bg-card border-border/50 text-foreground p-0 overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border/50 p-6">
          <div>
            <h2
              className="text-3xl uppercase tracking-wide mb-2"
              style={{ fontFamily: 'Bebas Neue, sans-serif' }}
            >
              Island Story: Timeline of Mauritius
            </h2>
            <p className="text-sm text-muted-foreground">From discovery to modern republic</p>
          </div>
        </div>

        {/* Timeline Content - Scrollable */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-100px)]">
          {/* Desktop: Horizontal Timeline */}
          <div className="hidden md:block">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-primary opacity-30" />
              
              {/* Events */}
              <div className="grid grid-cols-5 gap-4">
                {events.map((event, index) => (
                  <div key={index} className="relative">
                    {/* Dot */}
                    <div className="flex justify-center mb-4">
                      <div
                        className={`w-6 h-6 rounded-full bg-${getEventColor(event.period)} relative z-10`}
                        style={{
                          boxShadow: `0 0 20px hsl(var(--${getEventColor(event.period)}) / 0.5)`,
                        }}
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="text-center">
                      <Badge
                        className={`mb-2 bg-${getEventColor(event.period)}/20 text-${getEventColor(event.period)} border-${getEventColor(event.period)}/30`}
                      >
                        {event.year}
                      </Badge>
                      <h3
                        className="text-sm font-bold uppercase tracking-wide mb-1"
                        style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                      >
                        {event.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">{event.period}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile: Vertical Timeline */}
          <div className="md:hidden space-y-6">
            {events.map((event, index) => (
              <div key={index} className="flex gap-4">
                {/* Dot & Line */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-4 h-4 rounded-full bg-${getEventColor(event.period)} flex-shrink-0`}
                    style={{
                      boxShadow: `0 0 15px hsl(var(--${getEventColor(event.period)}) / 0.5)`,
                    }}
                  />
                  {index < events.length - 1 && (
                    <div className="w-0.5 h-full bg-border/30 mt-2" />
                  )}
                </div>
                
                {/* Content */}
                <div className="pb-6">
                  <Badge
                    className={`mb-2 bg-${getEventColor(event.period)}/20 text-${getEventColor(event.period)} border-${getEventColor(event.period)}/30 text-xs`}
                  >
                    {event.year}
                  </Badge>
                  <h3
                    className="text-lg font-bold uppercase tracking-wide mb-1"
                    style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                  >
                    {event.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{event.period}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
