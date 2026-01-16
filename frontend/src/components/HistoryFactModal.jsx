import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function HistoryFactModal({ fact, isOpen, onClose }) {
  if (!fact) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-card border-border/50 text-foreground p-0 overflow-hidden">
        <div className="max-h-[90vh] overflow-y-auto">
          {/* Header Image */}
          <div className="relative h-64 w-full overflow-hidden">
            <img
              src={fact.image}
              alt={fact.title}
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to top, hsl(var(--card)) 0%, transparent 100%)',
              }}
            />
          </div>

          <div className="p-8">
            <DialogHeader className="mb-6">
              <DialogTitle
                className="text-4xl uppercase tracking-wide"
                style={{ fontFamily: 'Bebas Neue, sans-serif' }}
              >
                {fact.title}
              </DialogTitle>
            </DialogHeader>

            {/* Content */}
            <div className="space-y-4 mb-6">
              {fact.content.map((paragraph, index) => (
                <p key={index} className="text-muted-foreground leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Source */}
            <div className="pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                <strong>Source:</strong> {fact.source}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
