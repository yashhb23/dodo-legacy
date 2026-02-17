import { useEffect, useState } from 'react';
import { Share2, Check, Heart } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import GalleryComments from '@/components/GalleryComments';
import { apiJson } from '@/lib/api';

export default function GalleryViewer({ image, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyboard = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [isOpen, onClose]);

  // Fetch likes when image opens
  useEffect(() => {
    if (image?.id && isOpen) {
      apiJson(`/api/gallery/${image.id}/likes`)
        .then(data => setLikes(data.count))
        .catch(console.error);

      // Reset local like state when opening new image
      setHasLiked(false);
    }
  }, [image, isOpen]);

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

  const handleLike = async () => {
    if (hasLiked) return;
    try {
      await apiJson(`/api/gallery/${image.id}/like`, { method: 'POST' });
      setLikes(prev => prev + 1);
      setHasLiked(true);
    } catch (err) {
      console.error('Like failed:', err);
    }
  };

  if (!image) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Solid background, no transparency */}
      <DialogContent className="max-w-5xl max-h-[95vh] w-full bg-background border-0 p-0 shadow-2xl overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>{image.title}</DialogTitle>
          <DialogDescription>
            Gallery image details and comments.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable wrapper for the entire modal content */}
        <div className="overflow-y-auto max-h-[95vh]">

          {/* Image -- full width, capped height */}
          <div className="relative w-full bg-black flex items-center justify-center">
            <img
              src={image.image}
              alt={image.title}
              className="w-full h-auto max-h-[60vh] object-contain"
            />

            {/* Like overlay */}
            <div className="absolute bottom-4 right-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike();
                }}
                className={`rounded-full w-11 h-11 bg-black/40 hover:bg-black/60 backdrop-blur-sm transition-all duration-300 ${hasLiked ? 'text-red-500 scale-110' : 'text-white hover:text-red-400 hover:scale-110'}`}
              >
                <Heart className={`w-5 h-5 ${hasLiked ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Info + Comments panel */}
          <div className="max-w-3xl mx-auto px-6 sm:px-10 py-10 space-y-8">

            {/* Meta */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="outline" className="text-secondary border-secondary/30 bg-secondary/5 text-xs">
                  {image.category}
                </Badge>
                <Badge variant="outline" className="text-muted-foreground border-border text-xs">
                  {image.era}
                </Badge>
                {likes > 0 && (
                  <span className="text-xs text-muted-foreground ml-auto">
                    ❤️ {likes}
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl uppercase tracking-wide font-bold text-foreground leading-tight">
                {image.title}
              </h2>

              <p className="text-base text-muted-foreground leading-relaxed">
                {image.description}
              </p>

              <div className="flex items-center justify-between pt-2">
                <p className="text-sm text-muted-foreground/60 italic">
                  Source: {image.source}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="gap-2 shrink-0"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Share'}
                </Button>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-border/40" />

            {/* Comments -- rendered directly, no extra wrapper */}
            <GalleryComments imageId={image.id} isOpen={isOpen} />

            {/* Bottom breathing room */}
            <div className="h-4" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
