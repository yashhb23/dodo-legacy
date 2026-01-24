import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Breadcrumbs from '@/components/Breadcrumbs';
import ShareButtons from '@/components/ShareButtons';

export default function CultureModal({ culture, isOpen, onClose }) {
  if (!culture) return null;

  const breadcrumbItems = [
    { label: 'Culture', onClick: () => document.getElementById('culture')?.scrollIntoView({ behavior: 'smooth' }) },
    { label: culture.title }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-card border-border/50 text-foreground p-0 overflow-hidden">
        <div className="max-h-[90vh] overflow-y-auto">
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
        </div>

          <div className="p-8">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} />
          
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
            <DialogDescription className="sr-only">
              Cultural topic details and highlights.
            </DialogDescription>
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

          {/* Share Buttons */}
          <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
            <ShareButtons 
              title={`${culture.title} - Mauritian Culture`}
              description={culture.content[0]?.substring(0, 150) + '...'}
            />
            <Button
              onClick={onClose}
              variant="outline"
              className="border-primary/50 hover:bg-primary/10"
            >
              Continue Exploring
            </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
