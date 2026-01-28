import AdminLayout from "@/components/admin/AdminLayout";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
    Plus,
    Trash2,
    Edit,
    Loader2,
    Upload,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Project {
    id: string;
    title: string;
    description: string;
    location: string;
    category: string;
    cover_image_url: string;
    completion_date: string;
    date_format?: 'year' | 'month' | 'full';
    sqft: string;
    created_at: string;
    work_images?: { image_url: string }[];
}

interface WorkImage {
    id: string;
    image_url: string;
    project_id?: string;
}

const AdminProjectCarousel = ({ project, onEdit, onDelete }: { project: Project, onEdit: () => void, onDelete: () => void }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const allImages = [project.cover_image_url];
    if (project.work_images && Array.isArray(project.work_images)) {
        project.work_images.forEach((img: any) => {
            if (img.image_url && img.image_url !== project.cover_image_url) {
                allImages.push(img.image_url);
            }
        });
    }

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (allImages.length > 1) {
            interval = setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
            }, 2000);
        }
        return () => clearInterval(interval);
    }, [allImages.length]);

    return (
        <div
            className="relative h-64 overflow-hidden bg-slate-100"
        >
            {allImages.map((img, index) => (
                <img
                    key={img}
                    src={img}
                    alt={project.title}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${index === currentImageIndex ? "opacity-100 scale-105" : "opacity-0 scale-100"
                        }`}
                />
            ))}

            {/* Admin Controls Overlay - Always visible on mobile, hover on desktop */}
            <div className="absolute top-4 right-4 flex gap-2 z-20">
                <Button
                    size="icon"
                    onClick={(e) => { e.stopPropagation(); onEdit(); }}
                    className="bg-white/90 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl shadow-sm h-8 w-8 transition-colors"
                >
                    <Edit className="w-4 h-4" />
                </Button>
                <Button
                    size="icon"
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="bg-white/90 text-red-600 hover:bg-red-600 hover:text-white rounded-xl shadow-sm h-8 w-8 transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>

            {/* Pagination Dots */}
            {allImages.length > 1 && (
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
                    {allImages.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const WorksGallery = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [existingGalleryImages, setExistingGalleryImages] = useState<WorkImage[]>([]);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
    const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

    // Delete Dialog State
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        category: "",
        sqft: "",
        completionDate: "",
        dateFormat: "full" as "year" | "month" | "full",
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('projects' as any)
                .select('*, work_images(*)')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProjects((data as any) || []);
        } catch (error: any) {
            toast.error("Failed to fetch projects");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };


    const fetchProjectImages = async (projectId: string) => {
        try {
            const { data, error } = await supabase
                .from('work_images' as any)
                .select('*')
                .eq('project_id', projectId);

            if (error) throw error;
            setExistingGalleryImages((data as any) || []);
        } catch (error) {
            console.error("Error fetching project images:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation: Projects must have at least one image
        const totalImages = (existingGalleryImages?.length || 0) + galleryFiles.length;
        if (totalImages === 0) {
            toast.error("Please add at least one project image");
            return;
        }

        try {
            setUploading(true);

            let projectId = editingProject?.id;
            let coverUrl = editingProject?.cover_image_url || "";
            const newUploadedImages: { url: string, path: string }[] = [];

            // 1. Upload new images first
            if (galleryFiles.length > 0) {
                const uploadPromises = galleryFiles.map(async (file) => {
                    const fileExt = file.name.split('.').pop();
                    const fileName = `project-gallery/${Math.random()}.${fileExt}`;

                    const { error: uploadError } = await supabase.storage
                        .from('uploads')
                        .upload(fileName, file);

                    if (uploadError) throw uploadError;

                    const { data: { publicUrl } } = supabase.storage
                        .from('uploads')
                        .getPublicUrl(fileName);

                    return { url: publicUrl, path: fileName };
                });

                const uploadedData = await Promise.all(uploadPromises);
                newUploadedImages.push(...uploadedData);

                // If no cover URL exists (new project), use the first uploaded image
                if (!coverUrl && newUploadedImages.length > 0) {
                    coverUrl = newUploadedImages[0].url;
                }
            }

            // 2. Create or Update Project
            const projectData = {
                title: formData.title,
                description: formData.description,
                location: formData.location,
                category: formData.category,
                sqft: formData.sqft,
                completion_date: formData.completionDate || null,
                date_format: formData.dateFormat,
                cover_image_url: coverUrl,
            };

            if (editingProject) {
                const { error } = await supabase
                    .from('projects' as any)
                    .update(projectData)
                    .eq('id', editingProject.id);

                if (error) throw error;
                toast.success("Project updated successfully!");
            } else {
                const { data, error } = await supabase
                    .from('projects' as any)
                    .insert([projectData])
                    .select()
                    .single();

                if (error) throw error;
                projectId = (data as any).id;
                toast.success("Project added successfully!");
            }

            // 3. Insert into work_images
            if (newUploadedImages.length > 0 && projectId) {
                const workImagesData = newUploadedImages.map(img => ({
                    project_id: projectId,
                    image_url: img.url,
                    storage_path: img.path,
                    name: formData.title,
                    type: 'Project Gallery',
                    location: formData.location,
                    is_published: true
                }));

                const { error: insertError } = await supabase
                    .from('work_images' as any)
                    .insert(workImagesData);

                if (insertError) throw insertError;
            }

            resetForm();
            setDialogOpen(false);
            fetchProjects();
        } catch (error: any) {
            toast.error(error.message || "Failed to save project");
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = (project: Project) => {
        setProjectToDelete(project);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!projectToDelete) return;

        try {
            // Delete from database
            const { error: dbError } = await supabase
                .from('projects' as any)
                .delete()
                .eq('id', projectToDelete.id);

            if (dbError) throw dbError;

            toast.success("Project deleted successfully!");
            fetchProjects();
        } catch (error: any) {
            toast.error("Failed to delete project");
            console.error(error);
        } finally {
            setDeleteDialogOpen(false);
            setProjectToDelete(null);
        }
    };

    const handleEdit = (project: Project) => {
        setEditingProject(project);
        setFormData({
            title: project.title,
            description: project.description || "",
            location: project.location || "",
            category: project.category || "",
            sqft: project.sqft || "",
            completionDate: project.completion_date || "",
            dateFormat: (project.date_format as "year" | "month" | "full") || "full",
        });
        fetchProjectImages(project.id);
        setDialogOpen(true);
    };



    const handleGalleryFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setGalleryFiles(prev => [...prev, ...files]);
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setGalleryPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeGalleryImage = (index: number) => {
        setGalleryFiles(prev => prev.filter((_, i) => i !== index));
        setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const deleteExistingImage = async (imageId: string) => {
        try {
            const { error } = await supabase
                .from('work_images' as any)
                .delete()
                .eq('id', imageId);

            if (error) throw error;
            setExistingGalleryImages(prev => prev.filter(img => img.id !== imageId));
            toast.success("Image removed");
        } catch (error) {
            toast.error("Failed to remove image");
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            location: "",
            category: "",
            sqft: "",
            completionDate: "",
            dateFormat: "full",
        });
        setEditingProject(null);
        setGalleryFiles([]);
        setGalleryPreviews([]);
        setExistingGalleryImages([]);
    };

    return (
        <AdminLayout>
            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-1">Works Gallery (Projects)</h1>
                    <p className="text-slate-400 text-sm font-medium">Manage your completed painting projects.</p>
                </div>

                <Dialog open={dialogOpen} onOpenChange={(open) => {
                    setDialogOpen(open);
                    if (!open) resetForm();
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#D32F2F] hover:bg-black text-white font-bold rounded-xl px-8 py-6 shadow-md shadow-red-100 transition-all flex items-center gap-2">
                            <Plus className="w-5 h-5" />
                            ADD NEW PROJECT
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black">
                                {editingProject ? "Edit Project" : "Add New Project"}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-xs font-black uppercase text-slate-400">Project Title</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Modern Villa Interior"
                                        className="h-12 rounded-xl"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category" className="text-xs font-black uppercase text-slate-400">Category</Label>
                                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                                        <SelectTrigger className="h-12 rounded-xl">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Interior Painting">Interior Painting</SelectItem>
                                            <SelectItem value="Exterior Painting">Exterior Painting</SelectItem>
                                            <SelectItem value="Waterproofing Solutions">Waterproofing Solutions</SelectItem>
                                            <SelectItem value="Climate Protection Coatings">Climate Protection Coatings</SelectItem>
                                            <SelectItem value="Wall Care & Surface Treatment">Wall Care & Surface Treatment</SelectItem>
                                            <SelectItem value="Commercial & Bulk Painting">Commercial & Bulk Painting</SelectItem>
                                            <SelectItem value="Full Home Makeover">Full Home Makeover</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-xs font-black uppercase text-slate-400">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe the project details, colors used, and specific challenges solved..."
                                    className="min-h-[100px] rounded-xl"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="location" className="text-xs font-black uppercase text-slate-400">Location</Label>
                                    <Input
                                        id="location"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="Edathua, Kerala"
                                        className="h-12 rounded-xl"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sqft" className="text-xs font-black uppercase text-slate-400">Area (Sq. Ft)</Label>
                                    <Input
                                        id="sqft"
                                        value={formData.sqft}
                                        onChange={(e) => setFormData({ ...formData, sqft: e.target.value })}
                                        placeholder="e.g. 2500 sq.ft"
                                        className="h-12 rounded-xl"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase text-slate-400">Date Format</Label>
                                    <Select
                                        value={formData.dateFormat}
                                        onValueChange={(value: "year" | "month" | "full") => setFormData({ ...formData, dateFormat: value })}
                                    >
                                        <SelectTrigger className="h-12 rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="full">Full Date (DD/MM/YYYY)</SelectItem>
                                            <SelectItem value="month">Month & Year</SelectItem>
                                            <SelectItem value="year">Year Only</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="date" className="text-xs font-black uppercase text-slate-400">Completion Date</Label>
                                    {formData.dateFormat === 'year' ? (
                                        <Input
                                            id="date"
                                            type="number"
                                            min="1990"
                                            max="2099"
                                            placeholder="YYYY"
                                            value={formData.completionDate ? formData.completionDate.split('-')[0] : ''}
                                            onChange={(e) => {
                                                const year = e.target.value;
                                                // Allow clearing
                                                if (!year) {
                                                    setFormData({ ...formData, completionDate: '' });
                                                    return;
                                                }
                                                // Update immediately so input reflects typing
                                                setFormData({ ...formData, completionDate: `${year}-01-01` });
                                            }}
                                            className="h-12 rounded-xl"
                                        />
                                    ) : formData.dateFormat === 'month' ? (
                                        <Input
                                            id="date"
                                            type="month"
                                            value={formData.completionDate ? formData.completionDate.substring(0, 7) : ''}
                                            onChange={(e) => setFormData({ ...formData, completionDate: `${e.target.value}-01` })}
                                            className="h-12 rounded-xl"
                                        />
                                    ) : (
                                        <Input
                                            id="date"
                                            type="date"
                                            value={formData.completionDate ? formData.completionDate.split('T')[0] : ''}
                                            onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                                            className="h-12 rounded-xl"
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="gallery" className="text-xs font-black uppercase text-slate-400">
                                    Project Images <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="gallery"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleGalleryFilesChange}
                                        className="h-12 rounded-xl"
                                    />
                                    <Upload className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                </div>
                                {(galleryPreviews.length > 0 || existingGalleryImages.length > 0) && (
                                    <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
                                        {existingGalleryImages.map((img) => (
                                            <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group">
                                                <img src={img.image_url} alt="Gallery" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => deleteExistingImage(img.id)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                        {galleryPreviews.map((url, idx) => (
                                            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group">
                                                <img src={url} alt="New Gallery" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeGalleryImage(idx)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={uploading}
                                className="w-full h-12 bg-[#D32F2F] hover:bg-black text-white font-bold rounded-xl"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                        {editingProject ? "Updating Project..." : "Creating Project..."}
                                    </>
                                ) : (
                                    editingProject ? "Update Project" : "Create Project"
                                )}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-[#D32F2F]" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div key={project.id} className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all h-full flex flex-col">
                            <AdminProjectCarousel project={project} onEdit={() => handleEdit(project)} onDelete={() => handleDelete(project)} />

                            <div className="p-6 flex-grow flex flex-col">
                                <h3 className="text-xl font-black text-slate-900 mb-2 line-clamp-1">{project.title}</h3>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="bg-slate-100 text-slate-600 rounded-md uppercase font-bold text-[10px] px-2 py-1 tracking-wider">
                                        {project.category}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4 flex-grow">{project.description}</p>
                                <div className="pt-4 border-t border-slate-50 flex items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    {project.location}
                                </div>
                            </div>
                        </div>
                    ))}

                    {projects.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                <Upload className="w-8 h-8 text-slate-300" />
                            </div>
                            <p className="text-slate-400 font-bold">No projects found</p>
                            <p className="text-slate-300 text-sm">Click "Add New Project" to get started</p>
                        </div>
                    )}
                </div>
            )}

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="font-bold text-xl">Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-500">
                            This action cannot be undone. This will permanently delete the project
                            {projectToDelete?.title && <span className="font-bold text-slate-700"> "{projectToDelete.title}" </span>}
                            and remove its data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold"
                        >
                            Delete Project
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
};

export default WorksGallery;
