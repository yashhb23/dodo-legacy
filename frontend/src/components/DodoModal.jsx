import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function DodoModal({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-card border-border/50 text-foreground p-0 overflow-hidden">
        {/* Header Image */}
        <div className="relative h-80 w-full overflow-hidden">
          <img
            src="https://www.pictureboxblue.com/wp-content/uploads/2021/02/Edwards_Dodo-s.jpg"
            alt="Dodo Bird"
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
            <DialogTitle
              className="text-4xl uppercase tracking-wide"
              style={{ fontFamily: 'Bebas Neue, sans-serif' }}
            >
              The Dodo: Extinct Icon of Mauritius
            </DialogTitle>
          </DialogHeader>

          {/* Content */}
          <div className="space-y-6">
            <div>
              <h3
                className="text-xl uppercase tracking-wide mb-3 text-primary"
                style={{ fontFamily: 'Bebas Neue, sans-serif' }}
              >
                What Was the Dodo?
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                The dodo (Raphus cucullatus) was a flightless bird endemic to Mauritius. Standing about 1 meter tall 
                and weighing 10-18 kg, it evolved in isolation without natural predators, losing its ability to fly. 
                It had a large hooked beak, small wings, and a plump body covered in grayish plumage.
              </p>
            </div>

            <div>
              <h3
                className="text-xl uppercase tracking-wide mb-3 text-primary"
                style={{ fontFamily: 'Bebas Neue, sans-serif' }}
              >
                Why Did It Go Extinct?
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The dodo became extinct less than a century after humans discovered Mauritius. Multiple factors 
                led to its rapid demise:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Human hunting:</strong> Dutch sailors and settlers hunted dodos for food, finding them easy prey due to their fearlessness.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Introduced species:</strong> Rats, pigs, dogs, cats, and monkeys brought by ships destroyed dodo eggs and competed for food.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Habitat destruction:</strong> Deforestation for settlements and agriculture eliminated the dodo's natural forest habitat.</span>
                </li>
              </ul>
            </div>

            <div>
              <h3
                className="text-xl uppercase tracking-wide mb-3 text-primary"
                style={{ fontFamily: 'Bebas Neue, sans-serif' }}
              >
                Legacy and Symbolism
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                The dodo became a symbol of human-caused extinction and the fragility of island ecosystems. 
                The phrase "dead as a dodo" entered language as a metaphor for obsolescence. Today, the dodo 
                represents Mauritius's unique heritage and serves as a reminder of the importance of conservation. 
                It appears on the Mauritian coat of arms and remains the island's most recognizable symbol worldwide.
              </p>
            </div>

            <div className="pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                <strong>Last confirmed sighting:</strong> 1662 | <strong>Extinction confirmed:</strong> Late 17th century
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
