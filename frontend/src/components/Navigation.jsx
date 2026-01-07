import { Menu, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { name: 'Heritage', href: '#heritage' },
  { name: 'Districts', href: '#districts' },
  { name: 'Culture', href: '#culture' },
  { name: 'Gallery', href: '#gallery' },
];

export default function Navigation({ isMenuOpen, setIsMenuOpen, scrolled, onSearchClick, onExploreClick }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Highlight section title briefly
      const title = element.querySelector('h2');
      if (title) {
        title.style.transition = 'all 0.3s ease';
        title.style.transform = 'scale(1.05)';
        title.style.color = 'hsl(var(--primary))';
        setTimeout(() => {
          title.style.transform = 'scale(1)';
          title.style.color = '';
        }, 600);
      }
    }
    setIsMenuOpen(false);
  };
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-background/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
      style={{ marginTop: scrolled ? '0' : '32px' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button onClick={scrollToTop} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-white font-bold text-xl">🦤</span>
              </div>
              <span className="text-xl font-bold tracking-wider" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                DODO LEGACY
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className="text-foreground/80 hover:text-foreground transition-colors duration-200 text-sm font-medium uppercase tracking-wide"
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={onSearchClick}>
              <Search className="w-5 h-5" />
            </Button>
            <Button
              onClick={onExploreClick}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
            >
              Explore
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-full"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background/98 backdrop-blur-md border-t border-border">
          <div className="px-4 pt-4 pb-6 space-y-4">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className="block w-full text-left text-foreground hover:text-primary transition-colors duration-200 text-base font-medium uppercase tracking-wide"
              >
                {item.name}
              </button>
            ))}
            <Button
              onClick={() => {
                onExploreClick();
                setIsMenuOpen(false);
              }}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity mt-4"
            >
              Explore
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
