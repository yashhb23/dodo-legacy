import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function DistrictModal({ district, isOpen, onClose }) {
  if (!district) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-card border-border/50 text-foreground p-0 overflow-hidden">
        {/* Header Image */}
        <div className="relative h-64 w-full overflow-hidden">
          <img
            src={district.image}
            alt={district.name}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, hsl(var(--card)) 0%, transparent 100%)',
            }}
          />
          
          {/* Close button */}
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
          {/* Title */}
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="text-5xl">{district.icon}</div>
              <div>
                <DialogTitle
                  className="text-4xl uppercase tracking-wide mb-2"
                  style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                >
                  {district.name}
                </DialogTitle>
                <Badge className="bg-secondary/20 text-secondary border-secondary/30">
                  {district.description}
                </Badge>
              </div>
            </div>
          </DialogHeader>

          {/* Overview */}
          <div className="mb-6">
            <h3
              className="text-xl uppercase tracking-wide mb-3 text-foreground/90"
              style={{ fontFamily: 'Bebas Neue, sans-serif' }}
            >
              Overview
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {district.overview}
            </p>
          </div>

          {/* Key Facts - 3 Bullets */}
          <div className="space-y-4">
            {/* History */}
            <div className="flex gap-4">
              <div
                className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1"
                style={{
                  boxShadow: '0 0 20px hsl(var(--primary) / 0.2)',
                }}
              >
                <span className="text-primary font-bold">H</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1 uppercase text-sm tracking-wide" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                  History
                </h4>
                <p className="text-sm text-muted-foreground">{district.history}</p>
              </div>
            </div>

            {/* Culture */}
            <div className="flex gap-4">
              <div
                className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-1"
                style={{
                  boxShadow: '0 0 20px hsl(var(--secondary) / 0.2)',
                }}
              >
                <span className="text-secondary font-bold">C</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1 uppercase text-sm tracking-wide" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                  Culture
                </h4>
                <p className="text-sm text-muted-foreground">{district.culture}</p>
              </div>
            </div>

            {/* Today */}
            <div className="flex gap-4">
              <div
                className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-1"
                style={{
                  boxShadow: '0 0 20px hsl(var(--accent) / 0.2)',
                }}
              >
                <span className="text-accent font-bold">T</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1 uppercase text-sm tracking-wide" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                  Today
                </h4>
                <p className="text-sm text-muted-foreground">{district.today}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
