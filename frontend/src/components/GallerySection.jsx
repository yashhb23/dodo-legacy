import { useState, memo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { galleryData } from '@/data/gallery';
import GalleryViewer from '@/components/GalleryViewer';

function GallerySection() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  // Extract unique categories from gallery data
  const categories = ['All', ...new Set(galleryData.map(item => item.category))];

  // Filter images based on active category
  const filteredImages = activeCategory === 'All' 
    ? galleryData 
    : galleryData.filter(item => item.category === activeCategory);

  const handleImageClick = (item) => {
    setSelectedImage(item);
    setIsViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
    setTimeout(() => setSelectedImage(null), 300);
  };

  return (
    <>
      <section id="gallery" className="relative py-24 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-1.5 bg-secondary/10 text-secondary border-secondary/20">
              Visual Archive
            </Badge>
            <h2 className="section-title mb-6">
              Historical <span className="text-secondary">Gallery</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Explore authentic photographs capturing Mauritius' vibrant culture, festivals, 
              and the beautiful diversity of its people.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className={`transition-all duration-300 ${
                  activeCategory === category 
                    ? 'bg-secondary text-white hover:bg-secondary/90' 
                    : 'hover:bg-secondary/10'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Masonry Grid with Always-Visible Captions */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredImages.map((item) => (
              <div
                key={item.id}
                className="group relative break-inside-avoid overflow-hidden rounded-lg border border-border/50 hover:border-secondary/50 transition-all duration-300 bg-card"
              >
                {/* Image */}
                <div
                  onClick={() => handleImageClick(item)}
                  className="cursor-pointer overflow-hidden"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105 img-fade"
                  loading="lazy"
                    decoding="async"
                    onLoad={(e) => {
                      e.currentTarget.classList.add('loaded');
                    }}
                    onError={(e) => {
                      console.error(`Failed to load image: ${item.image}`);
                      e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="%23f0f0f0"/><text x="50%" y="50%" text-anchor="middle" fill="%23999" font-size="16">Image not found</text></svg>';
                      e.currentTarget.classList.add('loaded');
                    }}
                  />
                </div>
                
                {/* Always-Visible Caption */}
                <div className="p-4">
                  <Badge className="mb-2 bg-secondary/80 text-white border-0 text-xs">
                    {item.category}
                  </Badge>
                  <h3 className="font-bold text-sm mb-2 text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                  {/* Click to expand hint */}
                  <button
                    onClick={() => handleImageClick(item)}
                    className="text-xs text-secondary hover:text-secondary/80 mt-2 font-medium transition-colors"
                  >
                    View details →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* No results message */}
          {filteredImages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No images found in this category.</p>
            </div>
          )}
        </div>
      </section>

      <GalleryViewer
        image={selectedImage}
        isOpen={isViewerOpen}
        onClose={handleCloseViewer}
      />
    </>
  );
}

// Memoize to prevent unnecessary re-renders with many images
export default memo(GallerySection);
