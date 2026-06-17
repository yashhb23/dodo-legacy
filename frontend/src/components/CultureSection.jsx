import { useState, memo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cultureData } from '@/data/culture';
import CultureModal from '@/components/CultureModal';

function CultureSection() {
  const [selectedCulture, setSelectedCulture] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCultureClick = (culture) => {
    setSelectedCulture(culture);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedCulture(null), 300);
  };

  return (
    <>
      <section id="culture" className="relative py-24 bg-gradient-to-b from-muted/20 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-1.5 bg-primary/15 text-red-200 border-primary/30 hover:bg-primary/25 hover:text-white">
              Living Traditions
            </Badge>
            <h2 className="section-title mb-6">
              Culture of <span className="text-primary">Mauritius</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A vibrant tapestry woven from centuries of migration, blending languages, cuisines, 
              religions, festivals, and artistic expressions into a unique island identity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {cultureData.map((item) => (
              <Card
                key={item.id}
                onClick={() => handleCultureClick(item)}
                className="group p-8 bg-card/30 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 cursor-pointer"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="text-6xl mb-2 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3
                    className="text-2xl font-bold uppercase tracking-wide"
                    style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.summary}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <CultureModal
        culture={selectedCulture}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}

// Memoize to prevent unnecessary re-renders
export default memo(CultureSection);
