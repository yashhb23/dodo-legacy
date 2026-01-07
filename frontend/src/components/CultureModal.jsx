import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function CultureModal({ culture, isOpen, onClose }) {
  if (!culture) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-card border-border/50 text-foreground p-0 overflow-hidden">
        {/* Header Image */}
        <div className="relative h-64 w-full overflow-hidden">
          <img
            src={culture.image}
            alt={culture.title}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, hsl(var(--card)) 0%, transparent 100%)',
            }}
          />
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-8">
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="text-5xl">{culture.icon}</div>
              <DialogTitle
                className="text-4xl uppercase tracking-wide"
                style={{ fontFamily: 'Bebas Neue, sans-serif' }}
              >
                {culture.title}
              </DialogTitle>
            </div>
          </DialogHeader>

          {/* Content Paragraphs */}
          <div className="space-y-4 mb-6">
            {culture.content.map((paragraph, index) => (
              <p key={index} className="text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Highlights */}
          <div className="pt-6 border-t border-border/50">
            <h3
              className="text-lg uppercase tracking-wide mb-4"
              style={{ fontFamily: 'Bebas Neue, sans-serif' }}
            >
              Key Highlights
            </h3>
            <ul className="space-y-2">
              {culture.highlights.map((highlight, index) => (
                <li key={index} className="flex gap-3 text-sm text-muted-foreground">
                  <span className="text-primary font-bold">•</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
