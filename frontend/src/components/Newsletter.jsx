import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Newsletter() {
    const handleEmailClick = () => {
        window.location.href = 'mailto:yashbeeharry363@gmail.com';
    };

    return (
        <div className="bg-muted/30 border border-border/50 rounded-2xl p-8 sm:p-12 mt-12 text-center">
            <div className="max-w-2xl mx-auto space-y-6">
                <h3 className="text-3xl font-bold uppercase tracking-wide" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                    Let's Connect & Work Together
                </h3>
                <p className="text-muted-foreground text-lg">
                    Interested in the Dodo Legacy project? Have stories to share or want to collaborate on preserving Mauritian heritage? We'd love to hear from you.
                </p>

                <div className="pt-4">
                    <Button
                        onClick={handleEmailClick}
                        size="lg"
                        className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg"
                    >
                        <Mail className="w-5 h-5 mr-3" />
                        yashbeeharry363@gmail.com
                    </Button>
                </div>
            </div>
        </div>
    );
}
