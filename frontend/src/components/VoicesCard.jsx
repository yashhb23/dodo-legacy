import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

export default function VoicesCard({ voice }) {
  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <img
          src={voice.avatar}
          alt={voice.name}
          className="w-12 h-12 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-foreground">{voice.name}</h4>
              <p className="text-sm text-muted-foreground">{voice.location}</p>
            </div>
            {voice.verified && (
              <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                Verified
              </Badge>
            )}
          </div>
          
          {/* Rating */}
          <div className="flex items-center gap-1 mt-1">
            {[...Array(voice.rating)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-primary text-primary" />
            ))}
            <span className="text-xs text-muted-foreground ml-1">{voice.date}</span>
          </div>
        </div>
      </div>

      {/* Experience Badge */}
      <Badge variant="outline" className="mb-3 text-xs">
        {voice.experience}
      </Badge>

      {/* Testimonial */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
        {voice.testimonial}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {voice.tags.map((tag, index) => (
          <span
            key={index}
            className="text-xs px-2 py-1 bg-muted/50 rounded-full text-muted-foreground"
          >
            #{tag}
          </span>
        ))}
      </div>
    </Card>
  );
}
