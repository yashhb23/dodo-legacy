import { voicesOfMauritius } from '@/data/testimonials';
import { Badge } from '@/components/ui/badge';
import VoicesCard from '@/components/VoicesCard';

export default function VoicesSection() {
  return (
    <section className="relative py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-4">
          <Badge className="mb-4 px-4 py-1.5 bg-primary/10 text-primary border-primary/20">
            Community Stories
          </Badge>
          <h2 className="section-title mb-4">
            Voices of <span className="text-primary">Mauritius</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-2">
            Real experiences from people across the island
          </p>
          <p className="text-sm text-muted-foreground/70 max-w-xl mx-auto italic">
            “Unbiased and unfiltered”
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {voicesOfMauritius.map((voice) => (
            <VoicesCard key={voice.id} voice={voice} />
          ))}
        </div>
      </div>
    </section>
  );
}
