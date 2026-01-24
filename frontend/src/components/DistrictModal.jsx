import { ChevronDown, ChevronUp } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import ShareButtons from '@/components/ShareButtons';

export default function DistrictModal({ district, isOpen, onClose }) {
  const [expandedSection, setExpandedSection] = useState(null);

  if (!district) return null;

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const breadcrumbItems = [
    { label: 'Districts', onClick: () => document.getElementById('districts')?.scrollIntoView({ behavior: 'smooth' }) },
    { label: district.name }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] bg-card border-border/50 text-foreground p-0 overflow-hidden">
        <div className="max-h-[90vh] overflow-y-auto">
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
        </div>

          <div className="p-8">
            {/* Breadcrumbs */}
            <Breadcrumbs items={breadcrumbItems} />
            
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
              <DialogDescription className="sr-only">
                District details, history, and highlights.
              </DialogDescription>
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

            {/* Share Buttons */}
            <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
              <ShareButtons 
                title={`Discover ${district.name} - Mauritius`}
                description={district.overview?.substring(0, 150) + '...'}
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
