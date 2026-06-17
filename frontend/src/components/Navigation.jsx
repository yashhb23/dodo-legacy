import { useEffect, useCallback, useRef, useState } from 'react';
import { Menu, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { name: 'Heritage', href: '#heritage' },
  { name: 'Districts', href: '#districts' },
  { name: 'Culture', href: '#culture' },
  { name: 'Gallery', href: '#gallery' },
  { name: 'Voices', href: '#voices' },
];

export default function Navigation({
  isMenuOpen: isMenuOpenProp,
  setIsMenuOpen: setIsMenuOpenProp,
  scrolled,
  onSearchClick = () => {},
  onExploreClick = () => {},
}) {
  const menuRef = useRef(null);
  // Work standalone when menu props are omitted (e.g. the admin page renders
  // <Navigation scrolled /> with no menu state). Falling back to local state
  // prevents "setIsMenuOpen is not a function" when the mobile hamburger is
  // tapped there.
  const [internalMenuOpen, setInternalMenuOpen] = useState(false);
  const isMenuOpen = isMenuOpenProp ?? internalMenuOpen;
  const setIsMenuOpen = setIsMenuOpenProp ?? setInternalMenuOpen;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeMenu = useCallback(() => setIsMenuOpen(false), [setIsMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeMenu();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen, closeMenu]);

  const handleNavClick = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
        }`}
      style={{ marginTop: scrolled ? '0' : '32px' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button onClick={scrollToTop} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src="/dodo-icon.png" alt="Dodo Legacy" className="w-10 h-10 rounded-full object-cover" />
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
              className="rounded-full h-11 w-11"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav-menu"
              aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div
          id="mobile-nav-menu"
          ref={menuRef}
          role="navigation"
          aria-label="Mobile navigation"
          className="md:hidden bg-background/98 backdrop-blur-md border-t border-border"
        >
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className="block w-full text-left text-foreground hover:text-primary transition-colors duration-200 text-base font-medium uppercase tracking-wide py-3 px-2 rounded-md hover:bg-primary/10 min-h-[44px]"
              >
                {item.name}
              </button>
            ))}
            <Button
              onClick={() => {
                onExploreClick();
                setIsMenuOpen(false);
              }}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity mt-4 min-h-[48px]"
            >
              Explore
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
