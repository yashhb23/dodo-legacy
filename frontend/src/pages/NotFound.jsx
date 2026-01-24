import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-card border border-border rounded-lg p-8 text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            Page Not Found
          </h1>
          <p className="text-muted-foreground">
            That page doesn’t exist (or the link is outdated). Try going back home or reloading.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => (window.location.href = '/')}
            className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          >
            Go Home
          </Button>
          <Button onClick={() => window.location.reload()} variant="outline" className="flex-1">
            Reload
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          If this keeps happening, refresh your browser cache and try again.
        </p>
      </div>
    </div>
  );
}

