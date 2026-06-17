import { useEffect, useState, lazy, Suspense } from "react";
import { Helmet } from "react-helmet";
import TopBanner from "@/components/TopBanner";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import { HistoryStack } from "@/components/HistoryStack/HistoryStack";
import HistorySection from "@/components/HistorySection";
import CultureSection from "@/components/CultureSection";
import GallerySection from "@/components/GallerySection";
import VoicesSection from "@/components/VoicesSection";
import CommunitySection from "@/components/CommunitySection";
import Footer from "@/components/Footer";
import DiscoveryWidget from "@/components/DiscoveryWidget";
import FestivalNotice from "@/components/FestivalNotice";
import Newsletter from "@/components/Newsletter";
import { districtsData } from "@/data/districts";

// Lazy load modal components for better performance
const SearchModal = lazy(() => import("@/components/SearchModal"));
const TimelineModal = lazy(() => import("@/components/TimelineModal"));
const DodoModal = lazy(() => import("@/components/DodoModal"));
const DistrictModal = lazy(() => import("@/components/DistrictModal"));
const CultureModal = lazy(() => import("@/components/CultureModal"));
const GalleryViewer = lazy(() => import("@/components/GalleryViewer"));
const QuizModal = lazy(() => import("@/components/QuizModal"));

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Modal states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [isDodoModalOpen, setIsDodoModalOpen] = useState(false);

  // Modals opened from search results
  const [selectedSearchDistrict, setSelectedSearchDistrict] = useState(null);
  const [isSearchDistrictModalOpen, setIsSearchDistrictModalOpen] =
    useState(false);
  const [selectedSearchCulture, setSelectedSearchCulture] = useState(null);
  const [isSearchCultureModalOpen, setIsSearchCultureModalOpen] =
    useState(false);
  const [selectedSearchGallery, setSelectedSearchGallery] = useState(null);
  const [isSearchGalleryViewerOpen, setIsSearchGalleryViewerOpen] =
    useState(false);

  // Quiz modal state
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hero badge click handlers
  const handleBadgeClick = (badge) => {
    if (badge === "heritage") {
      document
        .getElementById("heritage")
        .scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (badge === "island-story") {
      setIsTimelineOpen(true);
    } else if (badge === "extinct-icon") {
      setIsDodoModalOpen(true);
    }
  };

  // Search result click handler
  const handleSearchResultClick = (type, item) => {
    if (type === "district") {
      setSelectedSearchDistrict(item);
      setIsSearchDistrictModalOpen(true);
    } else if (type === "culture") {
      setSelectedSearchCulture(item);
      setIsSearchCultureModalOpen(true);
    } else if (type === "gallery") {
      setSelectedSearchGallery(item);
      setIsSearchGalleryViewerOpen(true);
    }
  };

  // Guided explore - auto scroll through sections
  const handleExploreClick = () => {
    const sections = [
      "#heritage",
      "#districts",
      "#culture",
      "#voices",
      "#gallery",
    ];
    let currentIndex = 0;

    const scrollToNext = () => {
      if (currentIndex < sections.length) {
        const element = document.querySelector(sections[currentIndex]);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });

          // Highlight section title
          const title = element.querySelector("h2");
          if (title) {
            title.style.transition = "all 0.3s ease";
            title.style.transform = "scale(1.05)";
            title.style.color = "hsl(var(--primary))";
            setTimeout(() => {
              title.style.transform = "scale(1)";
              title.style.color = "";
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
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(scrollToNext, 2000);
  };

  // Random discovery - opens a random district modal
  const handleRandomDiscover = () => {
    const randomDistrict =
      districtsData[Math.floor(Math.random() * districtsData.length)];
    setSelectedSearchDistrict(randomDistrict);
    setIsSearchDistrictModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>
          DODO LEGACY | Discover the Rich History & Culture of Mauritius
        </title>
        <meta
          name="description"
          content="Explore the captivating history of Mauritius - from the legendary dodo bird to vibrant districts, colonial history, and authentic Mauritian culture, through the voices of its people."
        />
        <meta
          name="keywords"
          content="Mauritius, dodo bird, Mauritian history, Mauritius culture, Port Louis, Le Morne, sega music, Mauritian heritage, Indian Ocean, Mauritius travel"
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="DODO LEGACY | Discover Mauritius" />
        <meta
          property="og:description"
          content="Explore the captivating history and vibrant culture of Mauritius - the Island of the Dodo. A digital journey through heritage, traditions, and natural wonders."
        />
        <meta
          property="og:image"
          content="https://images.unsplash.com/photo-1585556557157-cd9191630e4a?w=1200"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="DODO LEGACY | Discover Mauritius" />
        <meta
          name="twitter:description"
          content="Explore the captivating history and vibrant culture of Mauritius - the Island of the Dodo."
        />
        <meta
          name="twitter:image"
          content="https://images.unsplash.com/photo-1585556557157-cd9191630e4a?w=1200"
        />

        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "DODO LEGACY",
            description:
              "A digital experience exploring the rich history and culture of Mauritius",
            url: window.location.href,
            about: {
              "@type": "Place",
              name: "Mauritius",
              description:
                "Island nation in the Indian Ocean known for its diverse culture and history",
            },
          })}
        </script>
      </Helmet>

      <TopBanner />
      <Navigation
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        scrolled={scrolled}
        onSearchClick={() => setIsSearchOpen(true)}
        onExploreClick={handleExploreClick}
      />
      <HeroSection
        onBadgeClick={handleBadgeClick}
        onWatchStory={() => setIsTimelineOpen(true)}
      />
      {/* History Stack - 3D Interactive Timeline.
           The old mask-image fade was an offscreen-texture tax on every
           scroll frame; HistoryStack now carries its own static gradient
           edge fades, which composite for free. */}
      <div
        id="history-stack"
        role="region"
        aria-label="Interactive Mauritius Historical Timeline"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2">
            Mauritius Historical Timeline
          </h2>
          <p className="text-gray-400">
            Hover over the 3D stack to explore key moments in history
          </p>
        </div>
        <HistoryStack />
      </div>
      <HistorySection />
      <CultureSection />
      <GallerySection />
      <VoicesSection />
      <CommunitySection />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <Newsletter />
      </div>
      <Footer />

      {/* Discovery Widget - floating */}
      <DiscoveryWidget
        onRandomDiscover={handleRandomDiscover}
        onQuizOpen={() => setIsQuizOpen(true)}
      />

      {/* Next-festival notice - floating bottom-left, dismissible */}
      <FestivalNotice />

      {/* Global Modals - Lazy loaded for performance */}
      <Suspense fallback={null}>
        {isSearchOpen && (
          <SearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onResultClick={handleSearchResultClick}
          />
        )}
        {isTimelineOpen && (
          <TimelineModal
            isOpen={isTimelineOpen}
            onClose={() => setIsTimelineOpen(false)}
          />
        )}
        {isDodoModalOpen && (
          <DodoModal
            isOpen={isDodoModalOpen}
            onClose={() => setIsDodoModalOpen(false)}
          />
        )}
        {isQuizOpen && (
          <QuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
        )}

        {/* Search Result Modals */}
        {isSearchDistrictModalOpen && (
          <DistrictModal
            district={selectedSearchDistrict}
            isOpen={isSearchDistrictModalOpen}
            onClose={() => {
              setIsSearchDistrictModalOpen(false);
              setTimeout(() => setSelectedSearchDistrict(null), 300);
            }}
          />
        )}
        {isSearchCultureModalOpen && (
          <CultureModal
            culture={selectedSearchCulture}
            isOpen={isSearchCultureModalOpen}
            onClose={() => {
              setIsSearchCultureModalOpen(false);
              setTimeout(() => setSelectedSearchCulture(null), 300);
            }}
          />
        )}
        {isSearchGalleryViewerOpen && (
          <GalleryViewer
            image={selectedSearchGallery}
            isOpen={isSearchGalleryViewerOpen}
            onClose={() => {
              setIsSearchGalleryViewerOpen(false);
              setTimeout(() => setSelectedSearchGallery(null), 300);
            }}
          />
        )}
      </Suspense>
    </div>
  );
}
