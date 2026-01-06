import { useEffect, useState } from 'react';
import TopBanner from '@/components/TopBanner';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import HistorySection from '@/components/HistorySection';
import Footer from '@/components/Footer';
import { Menu, X } from 'lucide-react';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <TopBanner />
      <Navigation isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} scrolled={scrolled} />
      <HeroSection />
      <HistorySection />
      <Footer />
    </div>
  );
}
