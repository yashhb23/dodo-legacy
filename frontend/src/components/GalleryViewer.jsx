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
        .then(data => setLikes(data.count || 0))
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
      <DialogContent className="max-w-7xl h-[90vh] w-full bg-background border-0 p-0 shadow-2xl overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>{image.title}</DialogTitle>
          <DialogDescription>
            Gallery image details and comments.
          </DialogDescription>
        </DialogHeader>

        {/* Horizontal Layout: Content Left (45%), Image Right (55%) */}
        <div className="flex flex-col lg:flex-row h-full">
          
          {/* Left Panel: Metadata + Comments (scrollable) */}
          <div className="w-full lg:w-[45%] overflow-y-auto order-2 lg:order-1">
            <div className="p-6 lg:p-8 space-y-6">
              
              {/* Metadata Section */}
              <div className="space-y-4">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="outline" className="text-secondary border-secondary/30 bg-secondary/5 text-xs">
                    {image.category}
                  </Badge>
                  <Badge variant="outline" className="text-muted-foreground border-border text-xs">
                    {image.era}
                  </Badge>
                  {likes > 0 && (
                    <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
                      <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
                      {likes}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl uppercase tracking-wide font-bold text-foreground leading-tight">
                  {image.title}
                </h2>

                {/* Description */}
                <p className="text-base text-muted-foreground leading-relaxed">
                  {image.description}
                </p>

                {/* Source & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <p className="text-sm text-muted-foreground/60 italic">
                    Source: {image.source}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLike}
                      disabled={hasLiked}
                      className="gap-2 shrink-0"
                    >
                      <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current text-red-500' : ''}`} />
                      {hasLiked ? 'Liked' : 'Like'}
                    </Button>
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
              </div>

              {/* Elegant Divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/40"></div>
                </div>
              </div>

              {/* Comments Section */}
              <GalleryComments imageId={image.id} isOpen={isOpen} />
            </div>
          </div>

          {/* Right Panel: Image (fixed, no scroll) */}
          <div className="w-full lg:w-[55%] bg-black flex items-center justify-center relative order-1 lg:order-2 h-[40vh] lg:h-full">
            <img
              src={image.image}
              alt={image.title}
              className="w-full h-full object-contain p-4 lg:p-8"
            />
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
