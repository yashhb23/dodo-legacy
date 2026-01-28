import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiJson, getApiBaseUrl } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navigation from '@/components/Navigation';

export default function AdminComments() {
    const [searchParams] = useSearchParams();
    const secret = searchParams.get('secret');
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchComments = async () => {
        if (!secret) {
            setError('Secret key is required in URL (?secret=your_key)');
            setLoading(false);
            return;
        }

        try {
            const data = await apiJson(`/api/admin/comments?secret=${secret}`);
            setComments(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch comments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [secret]);

    const handleApprove = async (id) => {
        try {
            await apiJson(`/api/admin/comments/${id}/approve?secret=${secret}`, {
                method: 'PUT',
            });
            setComments(prev => prev.map(c => c.id === id ? { ...c, is_approved: true } : c));
        } catch (err) {
            alert('Failed to approve: ' + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this comment?')) return;
        try {
            await apiJson(`/api/admin/comments/${id}?secret=${secret}`, {
                method: 'DELETE',
            });
            setComments(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            alert('Failed to delete: ' + err.message);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navigation scrolled={true} />
            <div className="container mx-auto pt-24 pb-12 px-4">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">Comment Moderation</h1>
                    <Badge variant="outline">{comments.length} Total</Badge>
                </div>

                {error && (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {loading ? (
                    <p>Loading comments...</p>
                ) : (
                    <div className="grid gap-4">
                        {comments.map((comment) => (
                            <Card key={comment.id} className="bg-background/40 border-border/50">
                                <CardHeader className="flex flex-row items-center justify-between py-3">
                                    <div>
                                        <CardTitle className="text-lg">{comment.name}</CardTitle>
                                        <p className="text-xs text-muted-foreground">{new Date(comment.created_at).toLocaleString()}</p>
                                    </div>
                                    <div className="flex flex-row gap-2">
                                        {comment.is_approved ? (
                                            <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/20">Approved</Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-yellow-500 border-yellow-500/30">Pending</Badge>
                                        )}
                                        <p className="text-xs text-muted-foreground self-center ml-2">Image: {comment.image_id}</p>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm border-l-2 border-secondary/30 pl-3 italic mb-4">
                                        {comment.message}
                                    </p>
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
                        ))}
                        {comments.length === 0 && !error && (
                            <p className="text-center text-muted-foreground py-12">No comments found.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
