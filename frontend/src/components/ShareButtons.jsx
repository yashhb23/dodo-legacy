import { Share2, Twitter, Facebook, Link, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function ShareButtons({ title, description, url }) {
  const [copied, setCopied] = useState(false);
  
  const shareUrl = url || window.location.href;
  const shareTitle = title || 'Discover the Legacy of Mauritius';
  const shareText = description || 'Explore the rich history and culture of the Island of the Dodo';

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  const handleFacebookShare = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareTitle)}`;
    window.open(fbUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground uppercase tracking-wider">Share</span>
      
      {/* Native share (mobile) */}
      {typeof navigator !== 'undefined' && navigator.share && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary"
          onClick={handleNativeShare}
        >
          <Share2 className="w-4 h-4" />
        </Button>
      )}
      
      {/* Twitter */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2]"
        onClick={handleTwitterShare}
      >
        <Twitter className="w-4 h-4" />
      </Button>
      
      {/* Facebook */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full hover:bg-[#4267B2]/10 hover:text-[#4267B2]"
        onClick={handleFacebookShare}
      >
        <Facebook className="w-4 h-4" />
      </Button>
      
      {/* Copy Link */}
      <Button
        variant="ghost"
        size="icon"
        className={`h-8 w-8 rounded-full transition-colors ${copied ? 'bg-green-500/10 text-green-500' : 'hover:bg-primary/10 hover:text-primary'}`}
        onClick={handleCopyLink}
      >
        {copied ? <Check className="w-4 h-4" /> : <Link className="w-4 h-4" />}
      </Button>
    </div>
  );
}
