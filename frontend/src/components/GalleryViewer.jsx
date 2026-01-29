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
      <DialogContent className="max-w-7xl max-h-[95vh] w-full bg-background border-0 p-0 overflow-hidden shadow-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>{image.title}</DialogTitle>
          <DialogDescription>
            Gallery image details and comments.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col h-[95vh] overflow-y-auto">
          {/* Image Container - Full Width */}
          <div className="relative w-full bg-black min-h-[40vh] flex items-center justify-center">
            <img
              src={image.image}
              alt={image.title}
              className="w-full h-auto max-h-[70vh] object-contain"
            />
          </div>

          {/* Info Panel - Solid Background */}
          <div className="flex-1 bg-background">
            <div className="max-w-4xl mx-auto p-6 sm:p-8">

              {/* Header Section */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8 border-b border-border/50 pb-8">
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-secondary border-secondary/30 bg-secondary/5">
                      {image.category}
                    </Badge>
                    <Badge variant="outline" className="text-muted-foreground border-border">
                      {image.era}
                    </Badge>
                  </div>

                  <h2 className="text-3xl sm:text-4xl uppercase tracking-wide font-bold text-foreground">
                    {image.title}
                  </h2>

                  <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                    {image.description}
                  </p>

                  <p className="text-sm text-muted-foreground/60 italic">
                    Source: {image.source}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 shrink-0">
                  <Button
                    variant={hasLiked ? "secondary" : "outline"}
                    size="lg"
                    onClick={handleLike}
                    className={`gap-2 ${hasLiked ? 'text-red-500' : 'hover:text-red-500 hover:bg-red-500/10'}`}
                  >
                    <Heart className={`w-5 h-5 ${hasLiked ? 'fill-current' : ''}`} />
                    {likes > 0 && <span>{likes}</span>}
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleShare}
                    className="gap-2"
                  >
                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Share2 className="w-5 h-5" />}
                    {copied ? 'Copied' : 'Share'}
                  </Button>
                </div>
              </div>

              {/* Comments Section - Red Header, Spaced Out */}
              <div className="mt-12 pt-12">
                <div className="mb-8">
                  <h3 className="text-red-600 font-bold tracking-widest uppercase text-sm border-b-2 border-red-600 inline-block pb-1">
                    Community Comments
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Join the conversation about this piece of history.
                  </p>
                </div>

                <div className="bg-card/30 rounded-xl border border-border/50 p-6 sm:p-8">
                  <GalleryComments imageId={image.id} isOpen={isOpen} />
                </div>
              </div>

              {/* Extra Scroll Space */}
              <div className="h-24"></div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
