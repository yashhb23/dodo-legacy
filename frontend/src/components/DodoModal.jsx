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
                The dodo (Raphus cucullatus) was a flightless bird endemic only to Mauritius. Standing approximately 
                1 meter (3 feet) tall and weighing 10-18 kg (22-40 lbs), it evolved in isolation for millions of years 
                without natural predators. This lack of threat caused it to lose the ability to fly and develop fearlessness 
                toward humans—traits that would prove fatal. The dodo had a large hooked beak, small vestigial wings, 
                a plump body, and grayish-brown plumage.
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
                The dodo became extinct within approximately 60-80 years of human arrival (Dutch settlement 1638; extinction 
                circa 1662-1690). No complete specimens exist today—only sub-fossil bones and contemporary descriptions/drawings. 
                Multiple factors caused its rapid extinction:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Direct hunting by humans:</strong> Dutch sailors and settlers hunted dodos for fresh meat. The birds' fearlessness and inability to fly made them easy prey. However, dodo meat was reportedly unpalatable, so overhunting was not the primary cause.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Invasive species:</strong> Rats, pigs, dogs, cats, and monkeys introduced by Dutch ships destroyed dodo eggs and competed for food. Dodos nested on the ground, making eggs vulnerable. Rats likely had the most devastating impact on reproduction.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Habitat destruction:</strong> Dutch deforestation for timber and settlements eliminated the dodo's native ebony forest habitat. Loss of food sources (fruits, seeds) compounded population decline.</span>
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
                The dodo became the archetypal symbol of human-caused extinction. The phrase "dead as a dodo" entered 
                English language as a metaphor for obsolescence. Lewis Carroll immortalized the dodo in <em>Alice's Adventures 
                in Wonderland</em> (1865). Today, the dodo represents conservation awareness and the fragility of island 
                ecosystems. It appears on Mauritius' coat of arms alongside the extinct Rodrigues solitaire (another Mascarene 
                bird), symbolizing the nation's unique but vulnerable natural heritage. Scientists continue studying dodo 
                remains to understand its biology and extinction mechanics.
              </p>
            </div>

            <div className="pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                <strong>Last confirmed sighting:</strong> 1662 | <strong>Extinction confirmed:</strong> circa 1690 | <strong>Scientific classification:</strong> Raphus cucullatus (Columbidae family)
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
