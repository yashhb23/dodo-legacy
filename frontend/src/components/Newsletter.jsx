import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Newsletter() {
    const handleEmailClick = () => {
        window.location.href = 'mailto:dodolegacy1@gmail.com';
    };

    return (
        <div className="mt-16 mb-8 text-center border-t border-border/40 pt-8">
            <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                🔗 Let's Connect
            </h3>
            <p className="text-muted-foreground text-sm mb-4 max-w-md mx-auto">
                Have a story to share? We'd love to hear from you.
            </p>
            <Button
                onClick={handleEmailClick}
                variant="outline"
                className="gap-2 text-sm hover:bg-secondary/10 hover:text-secondary border-border/50"
            >
                <Mail className="w-4 h-4" />
                dodolegacy1@gmail.com
            </Button>
        </div>
    );
}
