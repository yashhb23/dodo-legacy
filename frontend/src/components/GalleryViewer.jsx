import { useEffect, useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import GalleryComments from '@/components/GalleryComments';

export default function GalleryViewer({ image, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyboard = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [isOpen, onClose]);

  const handleShare = async () => {
    const url = window.location.origin + '?image=' + image.id;
    if (navigator.share) {
      try {
        await navigator.share({
          title: image.title,
          text: image.description,
          url: url,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Copy failed:', err);
      }
    }
  };

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
                  <div className="flex items-center justify-between gap-4">
                    <h2
                      className="text-2xl sm:text-3xl uppercase tracking-wide mb-2"
                      style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                    >
                      {image.title}
                    </h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                      className="shrink-0 border-primary/30 hover:bg-primary/10"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 mr-2 text-green-500" />
                      ) : (
                        <Share2 className="w-4 h-4 mr-2" />
                      )}
                      {copied ? 'Copied' : 'Share'}
                    </Button>
                  </div>
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
