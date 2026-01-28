import AdminLayout from "@/components/admin/AdminLayout";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
    Plus,
    Trash2,
    Edit,
    Loader2,
    User,
    Phone as PhoneIcon,
    Briefcase,
    Search,
    Filter,
    Calendar,
    MapPin,
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

interface Worker {
    id: string;
    name: string;
    role: string;
    phone: string;
    status: string;
    employee_image?: string;
    joining_date?: string;
    resigning_date?: string;
    address?: string;
    created_at: string;
}

const WorkerTracking = () => {
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Delete Dialog State
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [workerToDelete, setWorkerToDelete] = useState<Worker | null>(null);

    // Filter & Search State
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");

    // Image State
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        role: "",
        phone: "",
        status: "Active",
        joiningDate: "",
        resigningDate: "",
        address: ""
    });

    useEffect(() => {
        fetchWorkers();
    }, []);

    const fetchWorkers = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('workers')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setWorkers((data as any) || []);
        } catch (error: unknown) {
            toast.error("Failed to fetch workers");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setSaving(true);
            let imageUrl = editingWorker?.employee_image || "";

            // Upload Image if selected
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `workers/${Math.random()}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('uploads')
                    .upload(fileName, imageFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('uploads')
                    .getPublicUrl(fileName);

                imageUrl = publicUrl;
            }

            const workerData = {
                name: formData.name,
                role: formData.role,
                phone: formData.phone,
                status: formData.status,
                joining_date: formData.joiningDate || null,
                resigning_date: formData.resigningDate || null,
                address: formData.address || null,
                employee_image: imageUrl
            };

            if (editingWorker) {
                // Update existing worker
                const { error } = await supabase
                    .from('workers')
                    .update(workerData as any)
                    .eq('id', editingWorker.id);

                if (error) throw error;
                toast.success("Worker updated successfully!");
            } else {
                // Create new worker
                const { error } = await supabase
                    .from('workers')
                    .insert([workerData as any]);

                if (error) throw error;
                toast.success("Worker added successfully!");
            }

            // Reset form and close dialog
            resetForm();
            setDialogOpen(false);
            fetchWorkers();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Failed to save worker";
            toast.error(errorMessage);
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = (worker: Worker) => {
        setWorkerToDelete(worker);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!workerToDelete) return;

        try {
            const { error } = await supabase
                .from('workers')
                .delete()
                .eq('id', workerToDelete.id);

            if (error) throw error;

            toast.success("Worker deleted successfully!");
            fetchWorkers();
        } catch (error: unknown) {
            toast.error("Failed to delete worker");
            console.error(error);
        } finally {
            setDeleteDialogOpen(false);
            setWorkerToDelete(null);
        }
    };

    const handleEdit = (worker: Worker) => {
        setEditingWorker(worker);
        setFormData({
            name: worker.name,
            role: worker.role,
            phone: worker.phone,
            status: worker.status,
            joiningDate: worker.joining_date || "",
            resigningDate: worker.resigning_date || "",
            address: worker.address || ""
        });
        setImagePreview(worker.employee_image || null);
        setDialogOpen(true);
    };

    const resetForm = () => {
        setFormData({
            name: "",
            role: "",
            phone: "",
            status: "Active",
            joiningDate: "",
            resigningDate: "",
            address: ""
        });
        setEditingWorker(null);
        setImageFile(null);
        setImagePreview(null);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Active": return "bg-emerald-50 text-emerald-600 border-emerald-100";
            case "Inactive": return "bg-slate-100 text-slate-400 border-slate-200";
            default: return "bg-slate-100 text-slate-500 border-slate-200";
        }
    };

    // Filter Logic
    const filteredWorkers = workers.filter(worker => {
        const matchesSearch = worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            worker.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
            worker.phone.includes(searchQuery);
        const matchesRole = roleFilter === "All" || worker.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const uniqueRoles = ["All", ...Array.from(new Set(workers.map(w => w.role)))];

    return (
        <AdminLayout>
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 mb-1">Worker Management</h1>
                        <p className="text-slate-400 text-sm font-medium">Manage your painting staff details.</p>
                    </div>

                    <Dialog open={dialogOpen} onOpenChange={(open) => {
                        setDialogOpen(open);
                        if (!open) resetForm();
                    }}>
                        <DialogTrigger asChild>
                            <Button className="bg-[#D32F2F] hover:bg-black text-white font-bold rounded-xl px-8 py-6 shadow-md shadow-red-100 transition-all flex items-center gap-2">
                                <Plus className="w-5 h-5" />
                                ADD NEW WORKER
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[700px] max-h-[90vh] p-0 gap-0 border-0 rounded-3xl overflow-hidden bg-white flex flex-col">
                            <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
                                {/* Scrollable Content */}
                                <div className="flex-1 overflow-y-auto scrollbar-hide">
                                    {/* Modal Header Background */}
                                    <div className="h-32 bg-gradient-to-r from-red-600 to-red-900 relative shrink-0">
                                        <div className="absolute top-4 left-6 z-10">
                                            <DialogTitle className="text-2xl font-black text-white tracking-tight">
                                                {editingWorker ? "Edit Profile" : "New Worker"}
                                            </DialogTitle>
                                            <p className="text-red-100/90 text-xs font-medium mt-1">
                                                {editingWorker ? "Update employee details below" : "Onboard a new team member"}
                                            </p>
                                        </div>
                                        {/* Decorative pattern */}
                                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
                                    </div>

                                    <div className="px-8 pb-8">
                                        {/* Centered Image Uploader */}
                                        <div className="relative -mt-12 mb-8 flex flex-col items-center z-20">
                                            <div className="relative group">
                                                <div className="w-24 h-24 rounded-[2.5rem] overflow-hidden bg-white ring-8 ring-white shadow-2xl flex items-center justify-center relative transition-transform duration-300 group-hover:scale-105">
                                                    {imagePreview ? (
                                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-300">
                                                            <User className="w-10 h-10" />
                                                        </div>
                                                    )}

                                                    {/* Overlay for actions */}
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                                                        {imagePreview && (
                                                            <button
                                                                type="button"
                                                                onClick={(e) => { e.preventDefault(); removeImage(); }}
                                                                className="p-2 bg-white/20 hover:bg-red-500 rounded-xl text-white transition-colors backdrop-blur-md"
                                                                title="Remove photo"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                        <label
                                                            htmlFor="image-upload"
                                                            className="p-2 bg-white/20 hover:bg-white text-white hover:text-black rounded-xl cursor-pointer transition-colors backdrop-blur-md"
                                                            title="Upload new photo"
                                                        >
                                                            <Upload className="w-4 h-4" />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <Input
                                                id="image-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                            <div className="mt-3 text-center">
                                                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Profile Photo</p>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            {/* Personal Details Section */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div className="space-y-1.5">
                                                    <Label htmlFor="name" className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Full Name *</Label>
                                                    <div className="relative group">
                                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                                                        <Input
                                                            id="name"
                                                            value={formData.name}
                                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                            placeholder="e.g. Rahul Sharma"
                                                            required
                                                            className="pl-10 h-11 bg-slate-50/50 border-slate-200 focus:border-red-500 focus:ring-red-100 rounded-xl font-medium transition-all"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <Label htmlFor="role" className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Job Role *</Label>
                                                    <div className="relative group">
                                                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                                                        <Input
                                                            id="role"
                                                            value={formData.role}
                                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                            placeholder="e.g. Senior Painter"
                                                            required
                                                            className="pl-10 h-11 bg-slate-50/50 border-slate-200 focus:border-red-500 focus:ring-red-100 rounded-xl font-medium transition-all"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <Label htmlFor="phone" className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Mobile Number</Label>
                                                    <div className="relative group">
                                                        <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                                                        <Input
                                                            id="phone"
                                                            value={formData.phone}
                                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                            placeholder="+91 98765 43210"
                                                            className="pl-10 h-11 bg-slate-50/50 border-slate-200 focus:border-red-500 focus:ring-red-100 rounded-xl font-medium transition-all"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <Label htmlFor="status" className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Status</Label>
                                                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                                                        <SelectTrigger className="h-11 bg-slate-50/50 border-slate-200 focus:ring-red-100 rounded-xl font-medium transition-all">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Active">Active</SelectItem>
                                                            <SelectItem value="Inactive">Inactive</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            {/* Dates Section */}
                                            <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100/80">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <Label htmlFor="joiningDate" className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Joined On</Label>
                                                        <div className="relative group bg-white rounded-xl shadow-sm">
                                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                                                            <Input
                                                                id="joiningDate"
                                                                type="date"
                                                                value={formData.joiningDate}
                                                                onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                                                                className="pl-10 h-11 border-slate-100 focus:border-red-500 focus:ring-red-100 rounded-xl font-medium text-sm transition-all"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label htmlFor="resigningDate" className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Resigned On</Label>
                                                        <div className="relative group bg-white rounded-xl shadow-sm">
                                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                                                            <Input
                                                                id="resigningDate"
                                                                type="date"
                                                                value={formData.resigningDate}
                                                                onChange={(e) => setFormData({ ...formData, resigningDate: e.target.value })}
                                                                className="pl-10 h-11 border-slate-100 focus:border-red-500 focus:ring-red-100 rounded-xl font-medium text-sm transition-all"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Address Section */}
                                            <div className="space-y-1.5">
                                                <Label htmlFor="address" className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Permanent Address</Label>
                                                <div className="relative group">
                                                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                                                    <Textarea
                                                        id="address"
                                                        value={formData.address}
                                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                        placeholder="Enter full residential address..."
                                                        className="pl-10 min-h-[80px] bg-slate-50/50 border-slate-200 focus:border-red-500 focus:ring-red-100 rounded-xl font-medium resize-none transition-all"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Fixed Footer */}
                                <div className="p-5 border-t border-slate-100 bg-white shrink-0 flex items-center justify-end gap-3 z-30">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setDialogOpen(false)}
                                        className="h-12 px-6 rounded-xl text-slate-500 font-bold hover:bg-slate-50 hover:text-slate-900"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={saving}
                                        className="h-12 px-8 bg-black hover:bg-neutral-800 text-white font-bold rounded-xl shadow-lg shadow-black/10 transition-all active:scale-[0.98] flex items-center gap-2"
                                    >
                                        {saving ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span>Saving...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>{editingWorker ? "Save Changes" : "Create Worker"}</span>
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Search and Filters */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                            placeholder="Search by name, role or phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white transition-colors"
                        />
                    </div>
                    <div className="w-full md:w-64">
                        <div className="relative">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10 pointer-events-none" />
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="h-12 rounded-xl pl-10 bg-slate-50 border-slate-200">
                                    <SelectValue placeholder="Filter by Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {uniqueRoles.map(role => (
                                        <SelectItem key={role} value={role}>{role}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-96">
                    <Loader2 className="w-10 h-10 animate-spin text-[#D32F2F]" />
                </div>
            ) : (
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="text-center px-4 py-5 text-[10px] font-black uppercase text-slate-400 tracking-wider">Photo</th>
                                    <th className="text-left px-4 py-5 text-[10px] font-black uppercase text-slate-400 tracking-wider">Name</th>
                                    <th className="text-left px-4 py-5 text-[10px] font-black uppercase text-slate-400 tracking-wider">Role</th>
                                    <th className="text-left px-4 py-5 text-[10px] font-black uppercase text-slate-400 tracking-wider">Mobile</th>
                                    <th className="text-left px-4 py-5 text-[10px] font-black uppercase text-slate-400 tracking-wider w-64">Address</th>
                                    <th className="text-left px-4 py-5 text-[10px] font-black uppercase text-slate-400 tracking-wider">Joined On</th>
                                    <th className="text-left px-4 py-5 text-[10px] font-black uppercase text-slate-400 tracking-wider">Resigned On</th>
                                    <th className="text-center px-4 py-5 text-[10px] font-black uppercase text-slate-400 tracking-wider">Status</th>
                                    <th className="text-center px-4 py-5 text-[10px] font-black uppercase text-slate-400 tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredWorkers.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="px-6 py-24 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                                    <Search className="w-6 h-6 text-slate-300" />
                                                </div>
                                                <p className="text-slate-900 font-bold mb-1">No workers found</p>
                                                <p className="text-slate-400 text-sm">Try adjusting your filters or add a new worker.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredWorkers.map((worker) => (
                                        <tr key={worker.id} className="hover:bg-slate-50/60 transition-colors group">
                                            <td className="px-4 py-4">
                                                <div className="flex justify-center">
                                                    <div
                                                        className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer hover:ring-2 hover:ring-[#D32F2F] hover:scale-110 transition-all shadow-sm"
                                                        onClick={() => setSelectedImage(worker.employee_image || null)}
                                                    >
                                                        {worker.employee_image ? (
                                                            <img src={worker.employee_image} alt={worker.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center font-black text-slate-300 text-lg">
                                                                {worker.name.charAt(0)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="font-bold text-slate-900">{worker.name}</span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-wide">
                                                    {worker.role}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="text-sm font-medium text-slate-600 font-mono tracking-tight">
                                                    {worker.phone || "—"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="w-full max-w-[200px]">
                                                    <span className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed" title={worker.address || ""}>
                                                        {worker.address || "—"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="text-sm text-slate-500 font-medium whitespace-nowrap">
                                                    {worker.joining_date ? new Date(worker.joining_date).toLocaleDateString() : "—"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="text-sm text-slate-500 font-medium whitespace-nowrap">
                                                    {worker.resigning_date ? new Date(worker.resigning_date).toLocaleDateString() : "—"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex justify-center">
                                                    <span className={`px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-wider ${getStatusColor(worker.status)}`}>
                                                        {worker.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => handleEdit(worker)}
                                                        className="h-9 w-9 text-slate-600 hover:bg-black hover:text-white rounded-xl transition-all"
                                                        title="Edit Worker"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => handleDelete(worker)}
                                                        className="h-9 w-9 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                                                        title="Delete Worker"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Image Preview Modal */}
            <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
                <DialogContent className="max-w-3xl p-0 overflow-hidden bg-transparent border-0 shadow-none z-50 flex items-center justify-center">
                    <div className="relative">
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-12 right-0 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all backdrop-blur-md"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        {selectedImage && (
                            <img
                                src={selectedImage}
                                alt="Worker Preview"
                                className="w-full h-auto max-h-[80vh] rounded-2xl shadow-2xl ring-4 ring-white/10"
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="font-bold text-xl">Confirm Deletion</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-500">
                            Are you sure you want to remove <span className="font-bold text-slate-700">{workerToDelete?.name}</span>?
                            This action cannot be undone and will permanently delete their profile and records.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold"
                        >
                            Delete Worker
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
};

export default WorkerTracking;
