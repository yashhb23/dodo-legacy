import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEffect } from 'react';

export default function GalleryViewer({ image, isOpen, onClose }) {
  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyboard = (e) => {
      if (e.key === 'Escape') onClose();
      // Could add Left/Right arrow navigation between images here
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [isOpen, onClose]);

  if (!image) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-full bg-background/98 border-0 p-0 overflow-hidden">
        <div className="relative">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-20 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>

          {/* Image */}
          <div className="relative w-full">
            <img
              src={image.image}
              alt={image.title}
              className="w-full h-auto max-h-[85vh] object-contain"
            />
          </div>

          {/* Info Panel */}
          <div className="p-8 bg-gradient-to-t from-background to-transparent">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <Badge className="mb-3 bg-secondary/20 text-secondary border-secondary/30">
                    {image.category} • {image.era}
                  </Badge>
                  <h2
                    className="text-3xl uppercase tracking-wide mb-2"
                    style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                  >
                    {image.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {image.description}
                  </p>
                  <p className="text-sm text-muted-foreground/70">
                    <strong>Source:</strong> {image.source}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
