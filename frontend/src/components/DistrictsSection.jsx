import { useState, memo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DistrictModal from '@/components/DistrictModal';
import { districtsData } from '@/data/districts';

/**
 * DistrictsSection — the island's nine districts as an interactive explorer.
 *
 * Extracted from the old HistorySection. That section's prose paragraph
 * re-told the same chronology as the 3D HistoryStack timeline (a third,
 * redundant timeline), so it was removed. The districts are the genuinely
 * distinct, non-timeline value worth keeping: geography and place, each
 * district opening a detail modal.
 */
function DistrictsSection() {
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDistrictClick = (district) => {
    setSelectedDistrict(district);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedDistrict(null), 300);
  };

  return (
    <>
      <section
        id="districts"
        className="relative py-24 bg-gradient-to-b from-background to-muted/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-4 py-1.5 bg-secondary/15 text-sky-200 border-secondary/30 hover:bg-secondary/25 hover:text-white">
              Explore Regions
            </Badge>
            <h2 className="section-title mb-4">
              Districts of <span className="text-secondary">Mauritius</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover the unique character of each of the island's nine districts
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {districtsData.map((district, index) => (
              <Card
                key={index}
                onClick={() => handleDistrictClick(district)}
                className="group p-6 bg-card/30 backdrop-blur-sm border-border/50 hover:border-secondary/50 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/10 hover:-translate-y-1 cursor-pointer"
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                    {district.icon}
                  </div>
                  <h3
                    className="text-xl font-bold uppercase tracking-wide"
                    style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                  >
                    {district.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {district.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <DistrictModal
        district={selectedDistrict}
        isOpen={isModalOpen}
        onClose={handleClose}
      />
    </>
  );
}

// Memoized: pure presentational section with many cards.
export default memo(DistrictsSection);
