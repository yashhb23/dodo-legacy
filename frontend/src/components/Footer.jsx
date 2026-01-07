import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import CreditsModal from '@/components/CreditsModal';

const footerLinks = [
  {
    title: 'Explore',
    links: ['Heritage', 'Districts', 'Culture', 'Gallery'],
  },
  {
    title: 'Learn',
    links: ['History', 'Wildlife', 'Conservation', 'Education'],
  },
  {
    title: 'Visit',
    links: ['Tourism', 'Museums', 'Natural Parks', 'Beaches'],
  },
  {
    title: 'Connect',
    links: ['Contact', 'Newsletter', 'Events', 'Community'],
  },
];

export default function Footer() {
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);
  return (
    <footer className="relative bg-gradient-to-b from-muted/20 to-background border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-white font-bold text-2xl">🦤</span>
              </div>
              <span className="text-2xl font-bold tracking-wider" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                DODO LEGACY
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Preserving and celebrating the rich heritage of Mauritius and its iconic dodo bird—a symbol of our unique island story.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" size="icon" className="rounded-full hover:bg-primary hover:text-white transition-colors">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full hover:bg-primary hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full hover:bg-secondary hover:text-white transition-colors">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full hover:bg-secondary hover:text-white transition-colors">
                <Youtube className="w-4 h-4" />
              </Button>
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
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link}
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
            © 2024 Dodo Legacy. Celebrating Mauritius Heritage.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
