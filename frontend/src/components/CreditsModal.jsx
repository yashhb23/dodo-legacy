import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function CreditsModal({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-border/50 text-foreground p-0 overflow-hidden">
        <div className="p-8">
          <DialogHeader className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <DialogTitle
                className="text-3xl uppercase tracking-wide"
                style={{ fontFamily: 'Bebas Neue, sans-serif' }}
              >
                Sources & Credits
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={onClose}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <h3
                className="text-lg uppercase tracking-wide mb-3 text-primary"
                style={{ fontFamily: 'Bebas Neue, sans-serif' }}
              >
                Purpose
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Dodo Legacy is an educational and cultural archive dedicated to preserving 
                and presenting the rich heritage of Mauritius. This digital museum experience 
                is designed for educational purposes, celebrating the island's history, culture, 
                and iconic dodo bird.
              </p>
            </div>

            <div>
              <h3
                className="text-lg uppercase tracking-wide mb-3 text-primary"
                style={{ fontFamily: 'Bebas Neue, sans-serif' }}
              >
                Historical Sources
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>National Archives of Mauritius</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Mauritius Museums Council</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Dutch East India Company Records</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>British Colonial Office Documentation</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>UNESCO World Heritage Documentation</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Natural History Museum Collections</span>
                </li>
              </ul>
            </div>

            <div>
              <h3
                className="text-lg uppercase tracking-wide mb-3 text-primary"
                style={{ fontFamily: 'Bebas Neue, sans-serif' }}
              >
                Image Credits
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                Historical dodo paintings and illustrations are in the public domain, sourced from:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Picture Box Blue (Public Domain Collection)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Unsplash (Free to use photography)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Historical archives and museum collections</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                <strong>Disclaimer:</strong> All content is presented for educational and cultural purposes. 
                Sources are credited where available. This is an independent heritage project, 
                not affiliated with any government or commercial entity.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
