import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { apiJson, getApiBaseUrl } from '@/lib/api';

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString();
}

export default function GalleryComments({ imageId, isOpen }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [message, setMessage] = useState('');
  const [name, setName] = useState(() => {
    try {
      return localStorage.getItem('dodoLegacyCommentName') || '';
    } catch {
      return '';
    }
  });
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const apiBase = useMemo(() => getApiBaseUrl(), []);
  const canUseApi = Boolean(apiBase);

  useEffect(() => {
    // Diagnostic log
    console.log('GalleryComments API Base:', apiBase, 'Can Use API:', canUseApi);
  }, [apiBase, canUseApi]);

  useEffect(() => {
    try {
      localStorage.setItem('dodoLegacyCommentName', name);
    } catch {
      // ignore
    }
  }, [name]);

  useEffect(() => {
    if (!isOpen || !imageId) return;
    if (!canUseApi) {
      setError('Comments are not configured. Please reload later.');
      setComments([]);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError('');

    apiJson(`/api/gallery/${encodeURIComponent(String(imageId))}/comments?limit=50`, {
      signal: controller.signal,
    })
      .then((data) => {
        setComments(Array.isArray(data) ? data : []);
      })
      .catch((e) => {
        if (e?.name === 'AbortError') return;
        setError(e?.message || 'Failed to load comments. Please reload.');
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [imageId, isOpen, canUseApi]);

  const submit = async (e) => {
    e.preventDefault();
    if (!canUseApi) return;

    const trimmedName = name.trim();
    const trimmedMessage = message.trim();
    if (!trimmedName || !trimmedMessage) return;

    setSubmitting(true);
    setError('');
    setShowSuccess(false);
    try {
      await apiJson(`/api/gallery/${encodeURIComponent(String(imageId))}/comments`, {
        method: 'POST',
        body: JSON.stringify({ name: trimmedName, message: trimmedMessage }),
      });

      setShowSuccess(true);
      setMessage('');
      // We don't add the comment to the list immediately because it needs approval
    } catch (e2) {
      setError(e2?.message || 'Failed to post comment. Please reload and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
          Comments
        </h3>
        {comments.length > 0 && (
          <Badge variant="outline" className="text-xs text-muted-foreground border-border/50">
            {comments.length}
          </Badge>
        )}
      </div>

      {!canUseApi && (
        <p className="text-xs text-muted-foreground">
          Comments will appear after the site is configured. If you just deployed, try reloading in a minute.
        </p>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Comment list */}
      {loading ? (
        <div className="space-y-4 py-2 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-3 w-24 bg-muted/50 rounded" />
                <div className="h-2.5 w-16 bg-muted/30 rounded" />
              </div>
              <div className="h-3 w-full bg-muted/40 rounded" />
              <div className="h-3 w-3/4 bg-muted/30 rounded" />
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4">
          No comments yet. Be the first to share your thoughts.
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="py-4 border-b border-border/30 last:border-b-0">
              <div className="flex items-baseline justify-between gap-3 mb-1">
                <p className="text-sm font-medium text-foreground">{c.name}</p>
                <p className="text-xs text-muted-foreground/60 shrink-0">{formatDate(c.created_at)}</p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{c.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Comment form */}
      <form onSubmit={submit} className="space-y-4 pt-2">
        {showSuccess && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-600 p-3 rounded-lg text-sm">
            Thanks! Your comment is under review and will appear once approved.
          </div>
        )}

        <p className="text-xs text-muted-foreground/70 italic">
          Use your real name and keep it respectful. Only genuine comments get approved.
        </p>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Name</label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setShowSuccess(false);
              }}
              placeholder="Your first name"
              required
              maxLength={40}
              className="bg-background/50 border-border/40 focus:border-secondary/50"
            />
            <p className="text-[11px] text-muted-foreground/60 mt-1">First name only</p>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Message</label>
            <Textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setShowSuccess(false);
              }}
              placeholder="Share your thoughts..."
              required
              maxLength={500}
              rows={3}
              className="bg-background/50 border-border/40 focus:border-secondary/50 min-h-[80px] resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={submitting || !canUseApi}
            size="sm"
            className="bg-secondary text-white hover:bg-secondary/90 px-6"
          >
            {submitting ? 'Posting...' : 'Post comment'}
          </Button>
        </div>
      </form>
    </div>
  );
}

