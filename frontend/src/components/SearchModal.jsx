import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { districtsData } from '@/data/districts';
import { cultureData } from '@/data/culture';
import { galleryData } from '@/data/gallery';

export default function SearchModal({ isOpen, onClose, onResultClick }) {
  const [query, setQuery] = useState('');

  const searchResults = () => {
    if (!query || query.length < 2) return { districts: [], culture: [], gallery: [] };

    const lowerQuery = query.toLowerCase();

    const districts = districtsData.filter(
      (d) =>
        d.name.toLowerCase().includes(lowerQuery) ||
        d.description.toLowerCase().includes(lowerQuery)
    );

    const culture = cultureData.filter(
      (c) =>
        c.title.toLowerCase().includes(lowerQuery) ||
        c.summary.toLowerCase().includes(lowerQuery)
    );

    const gallery = galleryData.filter(
      (g) =>
        g.title.toLowerCase().includes(lowerQuery) ||
        g.description.toLowerCase().includes(lowerQuery) ||
        g.category.toLowerCase().includes(lowerQuery)
    );

    return { districts, culture, gallery };
  };

  const results = searchResults();
  const hasResults = results.districts.length > 0 || results.culture.length > 0 || results.gallery.length > 0;

  const handleResultClick = (type, item) => {
    onResultClick(type, item);
    setQuery('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-card border-border/50 text-foreground p-0 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border/50">
          <DialogHeader>
            <div className="flex items-center justify-between mb-4">
              <DialogTitle
                className="text-2xl uppercase tracking-wide"
                style={{ fontFamily: 'Bebas Neue, sans-serif' }}
              >
                Search Heritage
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={onClose}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search districts, culture, gallery..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 bg-background border-border/50"
                autoFocus
              />
            </div>
          </DialogHeader>
        </div>

        {/* Results */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {query.length < 2 ? (
            <p className="text-center text-muted-foreground py-8">Type at least 2 characters to search</p>
          ) : !hasResults ? (
            <p className="text-center text-muted-foreground py-8">No results found for "{query}"</p>
          ) : (
            <div className="space-y-6">
              {/* Districts Results */}
              {results.districts.length > 0 && (
                <div>
                  <h3
                    className="text-lg uppercase tracking-wide mb-3 text-secondary"
                    style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                  >
                    Districts ({results.districts.length})
                  </h3>
                  <div className="space-y-2">
                    {results.districts.map((district) => (
                      <button
                        key={district.name}
                        onClick={() => handleResultClick('district', district)}
                        className="w-full text-left p-4 rounded-lg bg-background/50 hover:bg-background border border-border/50 hover:border-secondary/50 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{district.icon}</span>
                          <div>
                            <h4 className="font-bold">{district.name}</h4>
                            <p className="text-sm text-muted-foreground">{district.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Culture Results */}
              {results.culture.length > 0 && (
                <div>
                  <h3
                    className="text-lg uppercase tracking-wide mb-3 text-primary"
                    style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                  >
                    Culture ({results.culture.length})
                  </h3>
                  <div className="space-y-2">
                    {results.culture.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleResultClick('culture', item)}
                        className="w-full text-left p-4 rounded-lg bg-background/50 hover:bg-background border border-border/50 hover:border-primary/50 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.icon}</span>
                          <div>
                            <h4 className="font-bold">{item.title}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-1">{item.summary}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery Results */}
              {results.gallery.length > 0 && (
                <div>
                  <h3
                    className="text-lg uppercase tracking-wide mb-3 text-secondary"
                    style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                  >
                    Gallery ({results.gallery.length})
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {results.gallery.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleResultClick('gallery', item)}
                        className="text-left rounded-lg overflow-hidden bg-background/50 hover:bg-background border border-border/50 hover:border-secondary/50 transition-all"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-3">
                          <Badge className="mb-1 text-xs bg-secondary/20 text-secondary border-secondary/30">
                            {item.category}
                          </Badge>
                          <h4 className="font-bold text-sm line-clamp-1">{item.title}</h4>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
