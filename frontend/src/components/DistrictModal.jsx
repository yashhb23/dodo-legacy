import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function DistrictModal({ district, isOpen, onClose }) {
  const [expandedSection, setExpandedSection] = useState(null);

  if (!district) return null;

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl bg-card border-border/50 text-foreground p-0 overflow-hidden max-h-[90vh]">
        {/* Header Image */}
        <div className="relative h-64 w-full overflow-hidden">
          <img
            src={district.image}
            alt={district.name}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, hsl(var(--card)) 0%, transparent 100%)',
            }}
          />
          
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-256px)]">
          <div className="p-8">
            {/* Title */}
            <DialogHeader className="mb-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="text-5xl">{district.icon}</div>
                <div>
                  <DialogTitle
                    className="text-4xl uppercase tracking-wide mb-2"
                    style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                  >
                    {district.name}
                    {district.nameLocal && (
                      <span className="text-2xl text-muted-foreground ml-3">({district.nameLocal})</span>
                    )}
                  </DialogTitle>
                  <Badge className="bg-secondary/20 text-secondary border-secondary/30">
                    {district.description}
                  </Badge>
                </div>
              </div>
            </DialogHeader>

            {/* Geography & Overview - Always Visible */}
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-3">
                <strong>Geography:</strong> {district.geography}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {district.overview}
              </p>
            </div>

            {/* Accordion Sections */}
            <div className="space-y-3">
              {/* History Section */}
              <div className="border border-border/50 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('history')}
                  className="w-full flex items-center justify-between p-4 bg-card/30 hover:bg-card/50 transition-colors"
                >
                  <h3
                    className="text-xl uppercase tracking-wide text-primary"
                    style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                  >
                    History
                  </h3>
                  {expandedSection === 'history' ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
                {expandedSection === 'history' && (
                  <div className="p-4 bg-background/30">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {district.history}
                    </p>
                  </div>
                )}
              </div>

              {/* Important Places Section */}
              {district.landmarks && (
                <div className="border border-border/50 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection('places')}
                    className="w-full flex items-center justify-between p-4 bg-card/30 hover:bg-card/50 transition-colors"
                  >
                    <h3
                      className="text-xl uppercase tracking-wide text-secondary"
                      style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                    >
                      Important Places
                    </h3>
                    {expandedSection === 'places' ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                  {expandedSection === 'places' && (
                    <div className="p-4 bg-background/30">
                      <ul className="space-y-2">
                        {district.landmarks.map((landmark, index) => (
                          <li key={index} className="flex gap-2 text-sm text-muted-foreground">
                            <span className="text-secondary">•</span>
                            <span>{landmark}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Life Today Section */}
              <div className="border border-border/50 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('today')}
                  className="w-full flex items-center justify-between p-4 bg-card/30 hover:bg-card/50 transition-colors"
                >
                  <h3
                    className="text-xl uppercase tracking-wide text-primary"
                    style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                  >
                    Life Today
                  </h3>
                  {expandedSection === 'today' ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
                {expandedSection === 'today' && (
                  <div className="p-4 bg-background/30">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {district.today}
                    </p>
                  </div>
                )}
              </div>

              {/* Culture Section */}
              <div className="border border-border/50 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('culture')}
                  className="w-full flex items-center justify-between p-4 bg-card/30 hover:bg-card/50 transition-colors"
                >
                  <h3
                    className="text-xl uppercase tracking-wide text-secondary"
                    style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                  >
                    What This District Is Known For
                  </h3>
                  {expandedSection === 'culture' ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
                {expandedSection === 'culture' && (
                  <div className="p-4 bg-background/30">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {district.culture}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
