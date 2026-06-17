import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
        {/* Calm atmospheric backdrop so the timeline reads as serene and stays
            on-brand with the rest of the site without distracting from content. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 bg-cover bg-center opacity-40 pointer-events-none"
          style={{
            backgroundImage:
              "url('/assets/images/backgrounds/timeline-modal-calm.webp')",
          }}
        />
        {/* Accessibility: required title/description for Radix DialogContent */}
        <DialogHeader className="sr-only">
          <DialogTitle>Island Story: Timeline of Mauritius</DialogTitle>
          <DialogDescription>
            A timeline of key events in Mauritian history.
          </DialogDescription>
        </DialogHeader>
        {/* Header */}
        <div className="sticky top-0 z-20 bg-card/90 backdrop-blur-sm border-b border-border/50 p-6">
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
        <div className="relative z-10 p-8 overflow-y-auto max-h-[calc(90vh-100px)]">
          {/* Desktop: Horizontal Timeline */}
          <div className="hidden md:block">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-primary opacity-30" />
              
              {/* Events */}
              <div className="grid grid-cols-5 gap-4">
                {events.map((event, index) => (
                  <div
                    key={index}
                    className="relative group transition-transform duration-300 hover:-translate-y-1.5"
                  >
                    {/* Dot */}
                    <div className="flex justify-center mb-4">
                      <div
                        className={`w-6 h-6 rounded-full bg-${getEventColor(event.period)} relative z-10 group-hover:scale-125 transition-transform duration-300`}
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
              <div
                key={index}
                className="flex gap-4 transition-transform duration-300 hover:translate-x-1"
              >
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
