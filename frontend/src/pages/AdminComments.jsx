import { useCallback, useEffect, useState } from 'react';
import { apiJson } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navigation from '@/components/Navigation';
import { galleryData } from '@/data/gallery';

// The admin secret is held only in sessionStorage (cleared when the tab
// closes) and sent in the X-Admin-Secret header. It is never placed in the
// URL, so it cannot leak through browser history, server logs, shared links,
// or the Referer header to analytics/ad networks.
const SECRET_STORAGE_KEY = 'dodo_admin_secret';

export default function AdminComments() {
    const [secret, setSecret] = useState(
        () => sessionStorage.getItem(SECRET_STORAGE_KEY) || '',
    );
    const [secretInput, setSecretInput] = useState('');
    const [authed, setAuthed] = useState(false);
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Keep the admin panel out of search indexes (defence in depth; the real
    // gate is the server-side secret check). Injects a noindex meta tag for as
    // long as this page is mounted, then removes it on navigation away.
    useEffect(() => {
        const meta = document.createElement('meta');
        meta.name = 'robots';
        meta.content = 'noindex, nofollow';
        document.head.appendChild(meta);
        return () => {
            document.head.removeChild(meta);
        };
    }, []);

    const authHeaders = (s) => ({ 'X-Admin-Secret': s });

    const fetchData = useCallback(async (s) => {
        setLoading(true);
        setError('');
        try {
            const [commentsData, likesData] = await Promise.all([
                apiJson('/api/admin/comments', { headers: authHeaders(s) }),
                apiJson('/api/admin/likes', { headers: authHeaders(s) }).catch(() => []),
            ]);
            // A valid admin response is a JSON array. If the API is
            // misconfigured (e.g. an HTML fallback page returns with 200, which
            // happens with no backend in local dev), do NOT enter the dashboard
            // with non-array data: that would crash comments.map / likes.map.
            // Treat it as a load failure and stay on the login screen instead.
            if (!Array.isArray(commentsData)) {
                throw new Error('Unexpected response from the server. Please try again later.');
            }
            setComments(commentsData);
            setLikes(Array.isArray(likesData) ? likesData : []);
            setAuthed(true);
            sessionStorage.setItem(SECRET_STORAGE_KEY, s);
        } catch (err) {
            setAuthed(false);
            sessionStorage.removeItem(SECRET_STORAGE_KEY);
            setError(
                err.message === 'Unauthorized'
                    ? 'Incorrect secret key.'
                    : err.message || 'Failed to load dashboard.',
            );
        } finally {
            setLoading(false);
        }
    }, []);

    // Auto-restore an existing session on mount.
    useEffect(() => {
        if (secret) fetchData(secret);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        const s = secretInput.trim();
        if (!s) return;
        setSecret(s);
        fetchData(s);
    };

    const handleLogout = () => {
        sessionStorage.removeItem(SECRET_STORAGE_KEY);
        setSecret('');
        setSecretInput('');
        setAuthed(false);
        setComments([]);
        setLikes([]);
    };

    const handleApprove = async (id) => {
        try {
            await apiJson(`/api/admin/comments/${id}/approve`, {
                method: 'PUT',
                headers: authHeaders(secret),
            });
            setComments((prev) =>
                prev.map((c) => (c.id === id ? { ...c, is_approved: true } : c)),
            );
        } catch (err) {
            window.alert('Failed to approve: ' + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;
        try {
            await apiJson(`/api/admin/comments/${id}`, {
                method: 'DELETE',
                headers: authHeaders(secret),
            });
            setComments((prev) => prev.filter((c) => c.id !== id));
        } catch (err) {
            window.alert('Failed to delete: ' + err.message);
        }
    };

    const getImageDetails = (imageId) => {
        const img = galleryData.find((g) => String(g.id) === String(imageId));
        return img || { title: 'Unknown Image', image: null };
    };

    // Login gate: shown until a valid secret has been verified by the server.
    if (!authed) {
        return (
            <div className="min-h-screen bg-background text-foreground">
                <Navigation scrolled={true} />
                <div className="container mx-auto pt-24 pb-12 px-4 max-w-md">
                    <h1 className="text-2xl font-bold mb-2">Admin Login</h1>
                    <p className="text-sm text-muted-foreground mb-6">
                        Enter the admin secret to manage comments and likes.
                    </p>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            autoComplete="current-password"
                            placeholder="Admin secret key"
                            value={secretInput}
                            onChange={(e) => setSecretInput(e.target.value)}
                            className="w-full px-4 py-3 rounded-md bg-muted/30 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        {error && <p className="text-sm text-destructive">{error}</p>}
                        <Button
                            type="submit"
                            disabled={loading || !secretInput.trim()}
                            className="w-full"
                        >
                            {loading ? 'Verifying...' : 'Sign in'}
                        </Button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navigation scrolled={true} />
            <div className="container mx-auto pt-24 pb-12 px-4">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline">{comments.length} Comments</Badge>
                        <Badge variant="secondary">{likes.length} Likes</Badge>
                        <Button variant="outline" size="sm" onClick={handleLogout}>
                            Sign out
                        </Button>
                    </div>
                </div>

                {error && (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {loading ? (
                    <p>Loading dashboard...</p>
                ) : (
                    <Tabs defaultValue="comments" className="space-y-6">
                        <TabsList>
                            <TabsTrigger value="comments">Comments ({comments.length})</TabsTrigger>
                            <TabsTrigger value="likes">Recent Likes ({likes.length})</TabsTrigger>
                        </TabsList>

                        <TabsContent value="comments" className="space-y-4">
                            {comments.map((comment) => {
                                const imgDetails = getImageDetails(comment.image_id);
                                return (
                                    <Card key={comment.id} className="bg-background/40 border-border/50">
                                        <CardHeader className="flex flex-row items-start justify-between py-4">
                                            <div className="flex gap-4">
                                                {/* Thumbnail Image */}
                                                <div className="w-16 h-16 rounded overflow-hidden shrink-0 border border-border bg-muted">
                                                    {imgDetails.image ? (
                                                        <img src={imgDetails.image} alt="Thumbnail" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No Img</div>
                                                    )}
                                                </div>

                                                <div>
                                                    <CardTitle className="text-lg flex items-center gap-2">
                                                        {comment.name}
                                                        <span className="text-sm font-normal text-muted-foreground">on {imgDetails.title}</span>
                                                    </CardTitle>
                                                    <CardDescription>{new Date(comment.created_at).toLocaleString()}</CardDescription>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end gap-2">
                                                {comment.is_approved ? (
                                                    <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/20">Approved</Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-yellow-500 border-yellow-500/30">Pending</Badge>
                                                )}
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="bg-muted/30 p-4 rounded-md mb-4 border-l-4 border-primary/30">
                                                <p className="text-sm italic">"{comment.message}"</p>
                                            </div>
                                            <div className="flex gap-3 justify-end">
                                                {!comment.is_approved && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleApprove(comment.id)}
                                                        className="bg-green-600 hover:bg-green-700 text-white"
                                                    >
                                                        Approve
                                                    </Button>
                                                )}
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleDelete(comment.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                            {comments.length === 0 && <p className="text-center text-muted-foreground py-12">No comments found.</p>}
                        </TabsContent>

                        <TabsContent value="likes">
                            <div className="rounded-md border border-border">
                                <div className="grid grid-cols-1 divide-y divide-border">
                                    {likes.map((like) => {
                                        const imgDetails = getImageDetails(like.image_id);
                                        return (
                                            <div key={like.id || like.created_at} className="p-4 flex items-center justify-between hover:bg-muted/20">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded overflow-hidden shrink-0 border border-border bg-muted">
                                                        {imgDetails.image && (
                                                            <img src={imgDetails.image} alt="Thumbnail" className="w-full h-full object-cover" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">Like on <span className="text-primary">{imgDetails.title}</span></p>
                                                        <p className="text-xs text-muted-foreground">{new Date(like.created_at).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <Badge variant="outline">❤️</Badge>
                                            </div>
                                        );
                                    })}
                                    {likes.length === 0 && <p className="text-center p-8 text-muted-foreground">No likes recorded yet.</p>}
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                )}
            </div>
        </div>
    );
}
