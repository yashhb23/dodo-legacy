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
    <div className="mt-6 border-t border-border/50 pt-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h3 className="text-lg font-semibold">Comments</h3>
        <Badge className="bg-secondary/20 text-secondary border-secondary/30">
          {comments.length}
        </Badge>
      </div>

      {!canUseApi && (
        <p className="text-xs text-muted-foreground mb-3">
          Comments will appear after the site is configured. If you just deployed, try reloading in a minute.
        </p>
      )}

      {error && <p className="text-sm text-destructive mb-4">{error}</p>}

      {loading ? (
        <p className="text-sm text-muted-foreground mb-4">Loading comments…</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-muted-foreground mb-4">
          No comments yet. Be the first to share your thoughts.
        </p>
      ) : (
        <div className="space-y-3 mb-6">
          {comments.map((c) => (
            <div key={c.id} className="rounded-lg border border-border/50 bg-background/40 p-3">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-semibold">{c.name}</p>
                <p className="text-xs text-muted-foreground">{formatDate(c.created_at)}</p>
              </div>
              <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{c.message}</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={submit} className="space-y-3">
        {showSuccess && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-3 rounded-lg text-sm mb-3">
            Thank you! Your comment has been submitted and is awaiting approval.
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-1">
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setShowSuccess(false);
              }}
              placeholder="Your name"
              required
              maxLength={40}
              className="bg-background border-border/50"
            />
          </div>
          <div className="sm:col-span-2">
            <Textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setShowSuccess(false);
              }}
              placeholder="Write a comment…"
              required
              maxLength={500}
              className="bg-background border-border/50 min-h-[44px]"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={submitting || !canUseApi}
            className="bg-secondary text-white hover:bg-secondary/90"
          >
            {submitting ? 'Posting…' : 'Post comment'}
          </Button>
        </div>
      </form>
    </div>
  );
}

