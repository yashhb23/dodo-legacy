import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiJson } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navigation from '@/components/Navigation';
import { galleryData } from '@/data/gallery';

export default function AdminComments() {
    const [searchParams] = useSearchParams();
    const secret = searchParams.get('secret');
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = async () => {
        if (!secret) {
            setError('Secret key is required in URL (?secret=your_key)');
            setLoading(false);
            return;
        }

        try {
            const [commentsData, likesData] = await Promise.all([
                apiJson(`/api/admin/comments?secret=${secret}`),
                apiJson(`/api/admin/likes?secret=${secret}`).catch(() => [])
            ]);
            setComments(commentsData);
            setLikes(likesData);
        } catch (err) {
            setError(err.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
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

    const getImageDetails = (imageId) => {
        // Try strict string matching first
        let img = galleryData.find(g => String(g.id) === String(imageId));
        return img || { title: 'Unknown Image', image: null };
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navigation scrolled={true} />
            <div className="container mx-auto pt-24 pb-12 px-4">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <div className="flex gap-2">
                        <Badge variant="outline">{comments.length} Comments</Badge>
                        <Badge variant="secondary">{likes.length} Likes</Badge>
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
