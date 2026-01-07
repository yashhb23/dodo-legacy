import { useEffect, useState } from 'react';
import TopBanner from '@/components/TopBanner';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import HistorySection from '@/components/HistorySection';
import CultureSection from '@/components/CultureSection';
import GallerySection from '@/components/GallerySection';
import Footer from '@/components/Footer';
import SearchModal from '@/components/SearchModal';
import TimelineModal from '@/components/TimelineModal';
import DodoModal from '@/components/DodoModal';
import DistrictModal from '@/components/DistrictModal';
import CultureModal from '@/components/CultureModal';
import GalleryViewer from '@/components/GalleryViewer';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Modal states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [isDodoModalOpen, setIsDodoModalOpen] = useState(false);
  
  // Modals opened from search results
  const [selectedSearchDistrict, setSelectedSearchDistrict] = useState(null);
  const [isSearchDistrictModalOpen, setIsSearchDistrictModalOpen] = useState(false);
  const [selectedSearchCulture, setSelectedSearchCulture] = useState(null);
  const [isSearchCultureModalOpen, setIsSearchCultureModalOpen] = useState(false);
  const [selectedSearchGallery, setSelectedSearchGallery] = useState(null);
  const [isSearchGalleryViewerOpen, setIsSearchGalleryViewerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hero badge click handlers
  const handleBadgeClick = (badge) => {
    if (badge === 'heritage') {
      document.getElementById('heritage').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (badge === 'island-story') {
      setIsTimelineOpen(true);
    } else if (badge === 'extinct-icon') {
      setIsDodoModalOpen(true);
    }
  };

  // Search result click handler
  const handleSearchResultClick = (type, item) => {
    if (type === 'district') {
      setSelectedSearchDistrict(item);
      setIsSearchDistrictModalOpen(true);
    } else if (type === 'culture') {
      setSelectedSearchCulture(item);
      setIsSearchCultureModalOpen(true);
    } else if (type === 'gallery') {
      setSelectedSearchGallery(item);
      setIsSearchGalleryViewerOpen(true);
    }
  };

  // Guided explore - auto scroll through sections
  const handleExploreClick = () => {
    const sections = ['#heritage', '#districts', '#culture', '#gallery'];
    let currentIndex = 0;

    const scrollToNext = () => {
      if (currentIndex < sections.length) {
        const element = document.querySelector(sections[currentIndex]);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          
          // Highlight section title
          const title = element.querySelector('h2');
          if (title) {
            title.style.transition = 'all 0.3s ease';
            title.style.transform = 'scale(1.05)';
            title.style.color = 'hsl(var(--primary))';
            setTimeout(() => {
              title.style.transform = 'scale(1)';
              title.style.color = '';
            }, 1000);
          }
        }
        currentIndex++;
        if (currentIndex < sections.length) {
          setTimeout(scrollToNext, 3000); // Wait 3 seconds before next section
        }
      }
    };

    // Start from hero
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(scrollToNext, 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <TopBanner />
      <Navigation
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        scrolled={scrolled}
        onSearchClick={() => setIsSearchOpen(true)}
        onExploreClick={handleExploreClick}
      />
      <HeroSection onBadgeClick={handleBadgeClick} />
      <HistorySection />
      <CultureSection />
      <GallerySection />
      <Footer />

      {/* Global Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onResultClick={handleSearchResultClick}
      />
      <TimelineModal
        isOpen={isTimelineOpen}
        onClose={() => setIsTimelineOpen(false)}
      />
      <DodoModal
        isOpen={isDodoModalOpen}
        onClose={() => setIsDodoModalOpen(false)}
      />

      {/* Search Result Modals */}
      <DistrictModal
        district={selectedSearchDistrict}
        isOpen={isSearchDistrictModalOpen}
        onClose={() => {
          setIsSearchDistrictModalOpen(false);
          setTimeout(() => setSelectedSearchDistrict(null), 300);
        }}
      />
      <CultureModal
        culture={selectedSearchCulture}
        isOpen={isSearchCultureModalOpen}
        onClose={() => {
          setIsSearchCultureModalOpen(false);
          setTimeout(() => setSelectedSearchCulture(null), 300);
        }}
      />
      <GalleryViewer
        image={selectedSearchGallery}
        isOpen={isSearchGalleryViewerOpen}
        onClose={() => {
          setIsSearchGalleryViewerOpen(false);
          setTimeout(() => setSelectedSearchGallery(null), 300);
        }}
      />
    </div>
  );
}
