import { useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import GalleryComments from '@/components/GalleryComments';

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
      <DialogContent className="max-w-7xl max-h-[95vh] w-full bg-background/98 border-0 p-0 overflow-hidden">
        {/* Accessibility: required title/description for Radix DialogContent */}
        <DialogHeader className="sr-only">
          <DialogTitle>{image.title}</DialogTitle>
          <DialogDescription>
            Gallery image details and comments.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[95vh] overflow-y-auto">
          {/* Image */}
          <div className="relative w-full">
            <img
              src={image.image}
              alt={image.title}
              className="w-full h-auto max-h-[70vh] object-contain bg-black/5"
            />
          </div>

          {/* Info Panel */}
          <div className="p-6 sm:p-8 bg-gradient-to-t from-background to-transparent">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <Badge className="mb-3 bg-secondary/20 text-secondary border-secondary/30">
                    {image.category} • {image.era}
                  </Badge>
                  <h2
                    className="text-2xl sm:text-3xl uppercase tracking-wide mb-2"
                    style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                  >
                    {image.title}
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                    {image.description}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground/70">
                    <strong>Source:</strong> {image.source}
                  </p>
                </div>
              </div>

              <GalleryComments imageId={image.id} isOpen={isOpen} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
