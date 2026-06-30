import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { historyMilestones } from '@/data/historyMilestones.ts';

/**
 * TimelineModal — the flat, scannable view of the island's history.
 *
 * It reads from the SAME source as the 3D HistoryStack (historyMilestones), so
 * the two timelines can never disagree on which moments exist or their dates.
 * The 3D stack is the immersive view; this is the at-a-glance index.
 *
 * Note: tone classes are FULL literal strings (not `bg-${x}` interpolation),
 * because Tailwind's JIT only generates classes it can see literally in source.
 */
const TONES = [
  {
    dot: 'bg-primary',
    badge: 'bg-primary/15 text-primary border-primary/30',
    glow: '0 0 12px hsl(var(--primary) / 0.6)',
  },
  {
    dot: 'bg-secondary',
    badge: 'bg-secondary/15 text-secondary border-secondary/30',
    glow: '0 0 12px hsl(var(--secondary) / 0.6)',
  },
];

export default function TimelineModal({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl bg-card border-border/50 text-foreground p-0 overflow-hidden max-h-[90vh]">
        {/* Calm atmospheric backdrop, on-brand with the rest of the site. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 bg-cover bg-center opacity-40 pointer-events-none"
          style={{
            backgroundImage:
              "url('/assets/images/backgrounds/timeline-modal-calm.webp')",
          }}
        />

        <DialogHeader className="sr-only">
          <DialogTitle>Island Story: Timeline of Mauritius</DialogTitle>
          <DialogDescription>
            A chronological index of key moments in Mauritian history.
          </DialogDescription>
        </DialogHeader>

        {/* Header */}
        <div className="sticky top-0 z-20 bg-card/90 backdrop-blur-sm border-b border-border/50 p-6">
          <h2
            className="text-3xl uppercase tracking-wide mb-2"
            style={{ fontFamily: 'Bebas Neue, sans-serif' }}
          >
            Island Story: Timeline of Mauritius
          </h2>
          <p className="text-sm text-muted-foreground">
            All {historyMilestones.length} moments, from genesis to the present
          </p>
        </div>

        {/* Scannable grid of every milestone (kept in sync with the 3D stack). */}
        <div className="relative z-10 p-6 md:p-8 overflow-y-auto max-h-[calc(90vh-110px)]">
          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {historyMilestones.map((m, index) => {
              const t = TONES[index % 2];
              return (
                <li
                  key={m.id}
                  className="group rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`w-3 h-3 rounded-full shrink-0 ${t.dot}`}
                      style={{ boxShadow: t.glow }}
                    />
                    <Badge className={t.badge}>{m.date}</Badge>
                  </div>
                  <h3
                    className="text-base font-bold uppercase tracking-wide leading-snug"
                    style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                  >
                    {m.title}
                  </h3>
                  <p
                    className="text-xs text-muted-foreground mt-1 overflow-hidden"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {m.description}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </DialogContent>
    </Dialog>
  );
}
