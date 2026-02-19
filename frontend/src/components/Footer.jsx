import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import CreditsModal from '@/components/CreditsModal';

const footerLinks = [
  {
    title: 'Sections',
    links: [
      { name: 'Heritage', href: '#heritage' },
      { name: 'Districts', href: '#districts' },
      { name: 'Culture', href: '#culture' },
      { name: 'Gallery', href: '#gallery' },
      { name: 'Voices', href: '#voices' },
    ],
  },
  {
    title: 'Connect',
    links: [
      { name: 'Contact Us', href: 'mailto:dodolegacy1@gmail.com' },
      { name: 'Instagram', href: 'https://instagram.com' }, // Placeholder as requested
      { name: 'Twitter', href: 'https://twitter.com' },     // Placeholder as requested
    ],
  },
];

export default function Footer() {
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);

  const handleNavClick = (href, e) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Highlight effect
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
    }
  };

  return (
    <>
      <footer className="relative bg-gradient-to-b from-muted/20 to-background border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img src="/dodo-icon.png" alt="Dodo Legacy" className="w-12 h-12 rounded-full object-cover" />
                <span className="text-2xl font-bold tracking-wider" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                  DODO LEGACY
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                Preserving and celebrating the rich heritage of Mauritius and its iconic dodo bird—a symbol of our unique island story.
              </p>
              <div className="flex gap-3">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon" className="rounded-full hover:bg-primary hover:text-white transition-colors">
                    <Instagram className="w-4 h-4" />
                  </Button>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon" className="rounded-full hover:bg-primary hover:text-white transition-colors">
                    <Twitter className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </div>

            {/* Links Sections */}
            {footerLinks.map((section, index) => (
              <div key={index}>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        onClick={(e) => handleNavClick(link.href, e)}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        target={link.href.startsWith('http') ? '_blank' : undefined}
                        rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} Dodo Legacy. Celebrating Mauritius Heritage.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <button
                onClick={() => setIsCreditsOpen(true)}
                className="hover:text-foreground transition-colors"
              >
                Sources & Credits
              </button>
            </div>
          </div>
        </div>
      </footer>

      <CreditsModal isOpen={isCreditsOpen} onClose={() => setIsCreditsOpen(false)} />
    </>
  );
}
