import { useState, memo } from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { galleryData } from '@/data/gallery';
import GalleryViewer from '@/components/GalleryViewer';

function GallerySection() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

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
              Explore colonial-era photographs, dodo illustrations, and archival images 
              documenting Mauritius' rich historical journey.
            </p>
          </div>

          {/* Masonry Grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {galleryData.map((item) => (
              <div
                key={item.id}
                onClick={() => handleImageClick(item)}
                className="group relative break-inside-avoid cursor-pointer overflow-hidden rounded-lg border border-border/50 hover:border-secondary/50 transition-all duration-300"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <Badge className="mb-2 w-fit bg-secondary/80 text-white border-0 text-xs">
                    {item.category}
                  </Badge>
                  <h3 className="text-white font-bold text-sm mb-1">{item.title}</h3>
                  <p className="text-white/70 text-xs line-clamp-2">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
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
