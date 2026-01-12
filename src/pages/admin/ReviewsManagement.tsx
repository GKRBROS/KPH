import AdminLayout from "@/components/admin/AdminLayout";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
    Plus,
    Star,
    Trash2,
    Edit,
    Loader2,
    Image as ImageIcon,
    Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Review {
    id: string;
    name: string;
    image_url: string | null;
    review_text: string;
    rating: number;
    created_at: string;
}

const ReviewsManagement = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        review_text: "",
        rating: 5
    });

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setReviews(data || []);
        } catch (error) {
            console.error("Error fetching reviews:", error);
            toast.error("Failed to load reviews");
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImage = async (file: File): Promise<string | null> => {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `reviews/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('work_images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('work_images')
                .getPublicUrl(filePath);

            return data.publicUrl;
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image");
            return null;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            let imageUrl = editingReview?.image_url || null;

            if (imageFile) {
                const uploadedUrl = await uploadImage(imageFile);
                if (uploadedUrl) imageUrl = uploadedUrl;
            }

            if (editingReview) {
                const { error } = await supabase
                    .from('reviews')
                    .update({
                        name: formData.name,
                        review_text: formData.review_text,
                        rating: formData.rating,
                        image_url: imageUrl
                    })
                    .eq('id', editingReview.id);

                if (error) throw error;
                toast.success("Review updated successfully!");
            } else {
                const { error } = await supabase
                    .from('reviews')
                    .insert([{
                        name: formData.name,
                        review_text: formData.review_text,
                        rating: formData.rating,
                        image_url: imageUrl
                    }]);

                if (error) throw error;
                toast.success("Review added successfully!");
            }

            setShowDialog(false);
            resetForm();
            fetchReviews();
        } catch (error: any) {
            console.error("Error saving review:", error);
            toast.error(error.message || "Failed to save review");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (review: Review) => {
        setEditingReview(review);
        setFormData({
            name: review.name,
            review_text: review.review_text,
            rating: review.rating
        });
        setImagePreview(review.image_url);
        setShowDialog(true);
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            const { error } = await supabase
                .from('reviews')
                .delete()
                .eq('id', deleteId);

            if (error) throw error;

            toast.success("Review deleted successfully!");
            fetchReviews();
        } catch (error) {
            console.error("Error deleting review:", error);
            toast.error("Failed to delete review");
        } finally {
            setDeleteId(null);
        }
    };

    const resetForm = () => {
        setFormData({ name: "", review_text: "", rating: 5 });
        setImageFile(null);
        setImagePreview(null);
        setEditingReview(null);
    };

    const openAddDialog = () => {
        resetForm();
        setShowDialog(true);
    };

    return (
        <AdminLayout>
            <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">
                        Reviews Management
                    </h1>
                    <p className="text-slate-500 text-sm font-medium mt-2">
                        Manage customer testimonials and reviews
                    </p>
                </div>
                <Button
                    onClick={openAddDialog}
                    className="bg-primary hover:bg-red-700 text-white font-black rounded-xl shadow-lg"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Review
                </Button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : reviews.length === 0 ? (
                <Card className="p-12 text-center border-2 border-dashed">
                    <Star className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                    <h3 className="text-xl font-bold text-slate-600 mb-2">No reviews yet</h3>
                    <p className="text-slate-400 mb-6">Add your first customer review to get started</p>
                    <Button onClick={openAddDialog} className="bg-primary hover:bg-red-700">
                        <Plus className="w-5 h-5 mr-2" />
                        Add Review
                    </Button>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.map((review) => (
                        <Card key={review.id} className="p-6 border-2 border-slate-200 hover:border-primary transition-all">
                            <div className="flex items-start gap-4 mb-4">
                                {review.image_url ? (
                                    <img
                                        src={review.image_url}
                                        alt={review.name}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center">
                                        <span className="text-2xl font-black text-slate-500">
                                            {review.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                <div className="flex-1">
                                    <h3 className="font-black text-slate-900">{review.name}</h3>
                                    <div className="flex gap-1 mt-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < review.rating
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "text-slate-300"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 mb-4 line-clamp-3">{review.review_text}</p>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => handleEdit(review)}
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                >
                                    <Edit className="w-4 h-4 mr-1" />
                                    Edit
                                </Button>
                                <Button
                                    onClick={() => setDeleteId(review.id)}
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Add/Edit Dialog */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black">
                            {editingReview ? "Edit Review" : "Add New Review"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingReview ? "Update the review details below" : "Add a new customer review"}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Customer Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="John Doe"
                                required
                                className="h-12"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">Profile Image (Optional)</Label>
                            <div className="flex items-center gap-4">
                                {imagePreview && (
                                    <img src={imagePreview} alt="Preview" className="w-16 h-16 rounded-full object-cover" />
                                )}
                                <label className="flex-1 cursor-pointer">
                                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-primary transition-colors">
                                        <Upload className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                                        <span className="text-sm text-slate-600">Click to upload image</span>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="rating">Rating</Label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, rating: star })}
                                        className="p-2 hover:scale-110 transition-transform"
                                    >
                                        <Star
                                            className={`w-8 h-8 ${star <= formData.rating
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-slate-300"
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="review_text">Review</Label>
                            <Textarea
                                id="review_text"
                                value={formData.review_text}
                                onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
                                placeholder="Write the customer's review here..."
                                required
                                rows={4}
                                className="resize-none"
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowDialog(false)}
                                disabled={submitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={submitting}
                                className="bg-primary hover:bg-red-700"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                        Saving...
                                    </>
                                ) : (
                                    editingReview ? "Update Review" : "Add Review"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Review?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this review? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
};

export default ReviewsManagement;
