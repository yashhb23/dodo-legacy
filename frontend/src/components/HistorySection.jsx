import { useState } from 'react';
import { MapPin, Calendar, Users, Award } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DistrictModal from '@/components/DistrictModal';
import HistoryFactModal from '@/components/HistoryFactModal';
import { districtsData } from '@/data/districts';
import { historyFactsExpanded } from '@/data/historyFacts';

const facts = [
  {
    icon: Calendar,
    title: 'Discovered 1598',
    description: 'Dutch sailors first landed on the uninhabited island',
    color: 'primary',
    id: 'discovered-1598',
  },
  {
    icon: Users,
    title: 'Multicultural',
    description: 'Blend of Indian, African, Chinese, and European heritage',
    color: 'secondary',
    id: 'multicultural',
  },
  {
    icon: MapPin,
    title: 'Island Paradise',
    description: 'Located in the Indian Ocean, east of Madagascar',
    color: 'primary',
    id: 'island-paradise',
  },
  {
    icon: Award,
    title: 'Independence 1968',
    description: 'Gained sovereignty from British colonial rule',
    color: 'secondary',
    id: 'independence-1968',
  },
];

export default function HistorySection() {
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [isDistrictModalOpen, setIsDistrictModalOpen] = useState(false);
  const [selectedFact, setSelectedFact] = useState(null);
  const [isFactModalOpen, setIsFactModalOpen] = useState(false);

  const handleDistrictClick = (district) => {
    setSelectedDistrict(district);
    setIsDistrictModalOpen(true);
  };

  const handleCloseDistrictModal = () => {
    setIsDistrictModalOpen(false);
    setTimeout(() => setSelectedDistrict(null), 300);
  };

  const handleFactClick = (fact) => {
    setSelectedFact(historyFactsExpanded[fact.id]);
    setIsFactModalOpen(true);
  };

  const handleCloseFactModal = () => {
    setIsFactModalOpen(false);
    setTimeout(() => setSelectedFact(null), 300);
  };

  const scrollToDistricts = () => {
    document.getElementById('districts').scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <section id="heritage" className="relative py-24 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* History Title */}
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-1.5 bg-primary/10 text-primary border-primary/20">
              Our Heritage
            </Badge>
            <h2 className="section-title mb-6">
              The Story of <span className="text-primary">Mauritius</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Mauritius is a volcanic island nation in the Indian Ocean, discovered uninhabited by Portuguese 
              sailors around 1507. The Dutch colonized it in 1598, naming it after Prince Maurice of Nassau. 
              After Dutch abandonment in 1710, the French took control in 1715, developing sugar plantations. 
              Britain captured the island in 1810 during the Napoleonic Wars. Mauritius gained independence 
              in 1968 and became a republic in 1992. Today, it's known for its multicultural society, 
              thriving economy, and the extinct dodo bird—its most famous symbol.
            </p>
          </div>

          {/* Facts Grid - Now Clickable */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {facts.map((fact, index) => {
              const Icon = fact.icon;
              return (
                <Card
                  key={index}
                  onClick={() => handleFactClick(fact)}
                  className="group p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 cursor-pointer"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div
                      className={`w-14 h-14 rounded-full bg-gradient-to-br from-${fact.color} to-${fact.color}/70 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                      style={{
                        boxShadow: `0 0 20px hsl(var(--${fact.color}) / 0.3)`,
                      }}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                        {fact.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{fact.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Districts Section */}
          <div id="districts" className="mt-20">
            <div className="text-center mb-12">
              <Badge className="mb-4 px-4 py-1.5 bg-secondary/10 text-secondary border-secondary/20">
                Explore Regions
              </Badge>
              <h2 className="section-title mb-4">
                Districts of <span className="text-secondary">Mauritius</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover the unique character of each district across the island
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
                    <p className="text-sm text-muted-foreground">{district.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* District Modal */}
      <DistrictModal
        district={selectedDistrict}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
