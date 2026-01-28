import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

export default function Newsletter() {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail('');
            // In a real app, you would send this to your backend
        }
    };

    return (
        <div className="bg-muted/30 border border-border/50 rounded-2xl p-6 sm:p-8 mt-12">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="text-center lg:text-left">
                    <h3 className="text-2xl font-bold mb-2 uppercase tracking-wide" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                        Join the Legacy
                    </h3>
                    <p className="text-muted-foreground text-sm sm:text-base max-w-md">
                        Subscribe to our newsletter to receive updates on Mauritian heritage, conservation efforts, and new gallery additions.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="w-full lg:max-w-md flex flex-col sm:flex-row gap-3">
                    {subscribed ? (
                        <div className="w-full bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-lg text-center animate-fade-in">
                            <p className="font-semibold">Successfully Subscribed!</p>
                            <p className="text-xs mt-1">Check your inbox for a confirmation soon.</p>
                        </div>
                    ) : (
                        <>
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-background border-border/50 focus:border-primary/50"
                            />
                            <Button type="submit" className="bg-primary hover:bg-primary/90 text-white shrink-0">
                                <Send className="w-4 h-4 mr-2" />
                                Subscribe
                            </Button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}
