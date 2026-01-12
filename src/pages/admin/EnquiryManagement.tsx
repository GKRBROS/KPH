import AdminLayout from "@/components/admin/AdminLayout";
import {
    Phone,
    MapPin,
    Search,
    Loader2,
    Calendar,
    Ruler,
    Image as ImageIcon,
    Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Define the type based on our database schema
type Enquiry = {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    state: string | null;
    district: string | null;
    interested_in: string | null;
    sqft: string | null;
    project_details: string | null;
    image_urls: string[] | null;
    status: string;
    created_at: string;
};

const EnquiryManagement = () => {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('enquiries')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            setEnquiries(data || []);
        } catch (error: unknown) {
            toast.error("Failed to fetch enquiries");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('enquiries')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;

            setEnquiries(enquiries.map(e =>
                e.id === id ? { ...e, status: newStatus } : e
            ));
            toast.success(`Status updated to ${newStatus}`);
        } catch (error: unknown) {
            console.error(error);
            toast.error("Failed to update status");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "New": return "bg-white text-red-600 border-red-600 hover:bg-red-50";
            case "Contacted": return "bg-white text-black border-black hover:bg-slate-50";
            case "Closed": return "bg-white text-slate-500 border-slate-300 hover:bg-slate-50";
            default: return "bg-white text-slate-500 border-slate-300";
        }
    };

    const filteredEnquiries = enquiries.filter(enquiry => {
        const matchesSearch =
            enquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enquiry.phone?.includes(searchTerm) ||
            enquiry.district?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "all" || enquiry.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Render the enquiry details dialog content
    const renderEnquiryDialog = (enquiry: Enquiry) => (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-xl text-[10px] font-bold uppercase tracking-wider gap-1">
                    <Eye className="w-3 h-3" />
                    <span className="hidden sm:inline">Details</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-white max-h-[90vh] overflow-y-auto mx-4">
                <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl font-black uppercase">Enquiry Details</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-4">
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Customer Info</label>
                            <p className="font-bold text-slate-900">{enquiry.name}</p>
                            <p className="text-sm text-slate-600">{enquiry.phone}</p>
                            {enquiry.email && <p className="text-sm text-slate-600">{enquiry.email}</p>}
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Location</label>
                            <p className="text-sm text-slate-700 font-medium">{enquiry.district}, {enquiry.state}</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Project Requirements</label>
                            <p className="font-bold text-slate-900">{enquiry.interested_in}</p>
                            {enquiry.sqft && (
                                <p className="text-sm text-slate-600 mt-1"><span className="font-bold">Area:</span> {enquiry.sqft} sq.ft</p>
                            )}
                        </div>
                        {enquiry.project_details && (
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Description</label>
                                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    {enquiry.project_details}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {enquiry.image_urls && enquiry.image_urls.length > 0 && (
                    <div className="pt-6 border-t border-slate-100 mt-6">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" /> Attached Site Photos ({enquiry.image_urls.length})
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                            {enquiry.image_urls.map((url, idx) => (
                                <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="block relative aspect-video rounded-xl overflow-hidden border border-slate-200 group shadow-sm hover:shadow-md transition-shadow">
                                    <img src={url} alt={`Site ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        target.parentElement!.innerHTML = '<div class="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs">Image unavailable</div>';
                                    }} />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                    <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded-md px-2 py-1 text-[8px] font-bold uppercase text-slate-600">
                                        {idx + 1}/{enquiry.image_urls!.length}
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );

    return (
        <AdminLayout>
            <div className="mb-6 sm:mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">Enquiries</h1>
                    <p className="text-slate-400 text-xs sm:text-sm font-medium">Customer leads from your website forms.</p>
                </div>
            </div>

            <div className="bg-white p-2 sm:p-4 rounded-2xl sm:rounded-[32px] border border-slate-100 shadow-sm min-h-[400px]">
                <div className="p-4 sm:p-6 border border-slate-200 border-b-0 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white rounded-t-lg">
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                        <div className="relative flex-1 sm:max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
                            <Input
                                placeholder="Search (name, phone, location)..."
                                className="pl-12 bg-white border border-slate-200 rounded-lg h-11 sm:h-12 font-medium text-sm focus:ring-1 focus:ring-black"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-[180px] h-11 sm:h-12 bg-white border border-slate-200 rounded-lg font-medium text-sm focus:ring-1 focus:ring-black">
                                <SelectValue placeholder="Filter by Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="New">New Enquiries</SelectItem>
                                <SelectItem value="Contacted">Contacted</SelectItem>
                                <SelectItem value="Closed">Closed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={fetchEnquiries} variant="outline" size="icon" className="shrink-0 h-11 w-11 sm:h-10 sm:w-10 rounded-lg border-slate-200 text-black hover:bg-black hover:text-white transition-colors hidden lg:flex">
                        <Loader2 className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-hidden rounded-b-lg border border-t-0 border-slate-200 shadow-sm">
                    <table className="w-full text-left font-sans border-collapse">
                        <thead>
                            <tr className="text-[12px] font-black uppercase text-white tracking-widest bg-black border-b border-black">
                                <th className="px-6 py-5 font-bold border-r border-zinc-800">Client Details</th>
                                <th className="px-6 py-5 font-bold border-r border-zinc-800">Requirements</th>
                                <th className="px-6 py-5 font-bold border-r border-zinc-800">Site Photos</th>
                                <th className="px-6 py-5 font-bold border-r border-zinc-800">Location</th>
                                <th className="px-6 py-5 font-bold border-r border-zinc-800">Status</th>
                                <th className="px-6 py-5 font-bold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-24 text-center">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
                                            <p className="text-slate-400 text-sm font-medium animate-pulse">Loading enquiries...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredEnquiries.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-24 text-center">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Search className="w-8 h-8 text-slate-200" />
                                            <p className="text-slate-500 text-sm font-medium">No enquiries found using current filters.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredEnquiries.map((enquiry) => (
                                    <tr key={enquiry.id} className="hover:bg-slate-50 transition-colors duration-150 group">
                                        <td className="px-6 py-5 align-top border-r border-slate-200">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-bold text-black text-[15px] group-hover:text-red-600 transition-colors">
                                                    {enquiry.name}
                                                </span>
                                                <a href={`tel:${enquiry.phone}`} className="inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-600 hover:text-black transition-colors w-fit">
                                                    <Phone className="w-3 h-3 text-red-600" /> {enquiry.phone}
                                                </a>
                                                <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 mt-1 font-semibold">
                                                    <Calendar className="w-3 h-3" />
                                                    {format(new Date(enquiry.created_at), 'dd MMM yyyy • h:mm a')}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 align-top max-w-[280px] border-r border-slate-200">
                                            <div className="space-y-2">
                                                <div className="flex flex-wrap gap-2">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded border border-slate-200 text-black text-[11px] font-bold bg-white">
                                                        {enquiry.interested_in}
                                                    </span>
                                                    {enquiry.sqft && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 text-slate-600 text-[11px] font-bold">
                                                            <Ruler className="w-3 h-3" /> {enquiry.sqft} sq.ft
                                                        </span>
                                                    )}
                                                </div>
                                                {enquiry.project_details && (
                                                    <p className="text-[12px] text-slate-500 leading-relaxed line-clamp-2">
                                                        {enquiry.project_details}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 align-top border-r border-slate-200">
                                            {enquiry.image_urls && enquiry.image_urls.length > 0 ? (
                                                <div className="flex items-center -space-x-2 hover:space-x-1 transition-all duration-300 pl-2">
                                                    {enquiry.image_urls.slice(0, 3).map((url, idx) => (
                                                        <div key={idx} className="relative w-10 h-10 rounded border-2 border-white shadow-sm hover:shadow-md hover:scale-110 hover:z-10 transition-all duration-200 bg-slate-100">
                                                            <img
                                                                src={url}
                                                                alt={`Site ${idx + 1}`}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                                }}
                                                            />
                                                        </div>
                                                    ))}
                                                    {enquiry.image_urls.length > 3 && (
                                                        <div className="relative flex items-center justify-center w-10 h-10 rounded border-2 border-white bg-black text-white shadow-sm z-10">
                                                            <span className="text-[10px] font-bold">+{enquiry.image_urls.length - 3}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-[11px] text-slate-400 font-medium italic pl-1">No images</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-5 align-top border-r border-slate-200">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[13px] font-bold text-slate-800">{enquiry.district}</span>
                                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{enquiry.state}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 align-middle border-r border-slate-200">
                                            <Select
                                                defaultValue={enquiry.status}
                                                onValueChange={(value) => updateStatus(enquiry.id, value)}
                                            >
                                                <SelectTrigger className={`h-8 w-[130px] text-[11px] font-bold uppercase tracking-wide border-2 transition-all duration-200 ${getStatusColor(enquiry.status)}`}>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="New" className="text-red-600 focus:text-red-700 focus:bg-red-50 font-bold">New Enquiry</SelectItem>
                                                    <SelectItem value="Contacted" className="text-black focus:text-black focus:bg-slate-50 font-bold">Contacted</SelectItem>
                                                    <SelectItem value="Closed" className="text-slate-500 focus:text-slate-700 focus:bg-slate-50 font-bold">Closed</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </td>
                                        <td className="px-6 py-5 align-middle text-right">
                                            {renderEnquiryDialog(enquiry)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden p-3 sm:p-4 space-y-4">
                    {loading ? (
                        <div className="py-12 text-center text-slate-500 text-sm font-medium">
                            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3 text-[#D32F2F]" />
                            Loading enquiries...
                        </div>
                    ) : filteredEnquiries.length === 0 ? (
                        <div className="py-16 text-center text-slate-500 text-sm font-medium bg-slate-50 rounded-[32px] border border-dashed border-slate-200">
                            No enquiries found.
                        </div>
                    ) : (
                        filteredEnquiries.map((enquiry) => (
                            <div key={enquiry.id} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all active:scale-[0.99]">
                                {/* Header with name and status */}
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-black text-slate-900 leading-tight mb-1">{enquiry.name}</h3>
                                        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-bold uppercase tracking-wide">
                                            <Phone className="w-3.5 h-3.5 text-[#D32F2F]" /> {enquiry.phone}
                                        </div>
                                    </div>
                                    <Select
                                        defaultValue={enquiry.status}
                                        onValueChange={(value) => updateStatus(enquiry.id, value)}
                                    >
                                        <SelectTrigger className={`h-8 w-[110px] text-[10px] font-black uppercase tracking-wide border-none shadow-sm ${getStatusColor(enquiry.status)}`}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="New">New</SelectItem>
                                            <SelectItem value="Contacted">Contacted</SelectItem>
                                            <SelectItem value="Closed">Closed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Project details */}
                                <div className="flex flex-wrap items-center gap-2 mb-4">
                                    <span className="bg-slate-50 rounded-xl px-3 py-1.5 text-[12px] font-bold text-slate-800 border border-slate-100">
                                        {enquiry.interested_in}
                                    </span>
                                    {enquiry.sqft && (
                                        <span className="flex items-center gap-1.5 bg-slate-50 rounded-xl px-3 py-1.5 text-[12px] text-slate-600 font-bold border border-slate-100">
                                            <Ruler className="w-3.5 h-3.5 text-slate-400" /> {enquiry.sqft} sq.ft
                                        </span>
                                    )}
                                </div>

                                {/* Image thumbnails */}
                                {enquiry.image_urls && enquiry.image_urls.length > 0 && (
                                    <div className="mb-5 bg-slate-50/50 rounded-2xl p-3 border border-slate-100">
                                        <div className="flex items-center gap-2 mb-3">
                                            <ImageIcon className="w-4 h-4 text-purple-600" />
                                            <span className="text-[10px] text-purple-600 font-black uppercase tracking-widest">
                                                {enquiry.image_urls.length} Site Photos
                                            </span>
                                        </div>
                                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                                            {enquiry.image_urls.slice(0, 4).map((url, idx) => (
                                                <a
                                                    key={idx}
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-sm hover:shadow-md transition-all active:scale-95"
                                                >
                                                    <img
                                                        src={url}
                                                        alt={`Site ${idx + 1}`}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect fill="%23f1f5f9" width="64" height="64"/><text x="50%" y="50%" font-size="12" fill="%2394a3b8" text-anchor="middle" dominant-baseline="middle">?</text></svg>';
                                                        }}
                                                    />
                                                </a>
                                            ))}
                                            {enquiry.image_urls.length > 4 && (
                                                <div className="shrink-0 w-20 h-20 rounded-2xl bg-slate-900 border-2 border-white shadow-sm flex flex-col items-center justify-center p-2 text-center">
                                                    <span className="text-lg font-black text-white">+{enquiry.image_urls.length - 4}</span>
                                                    <span className="text-[8px] font-bold text-slate-400 uppercase">More</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Location, date and action */}
                                <div className="flex items-end justify-between border-t border-slate-100 pt-4 mt-2">
                                    <div className="flex flex-col gap-2 text-[11px] text-slate-500 font-bold uppercase tracking-wide">
                                        <span className="flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5 text-slate-400" /> {enquiry.district}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-[10px] text-slate-400">
                                            <Calendar className="w-3.5 h-3.5" /> {format(new Date(enquiry.created_at), 'dd MMM yyyy • h:mm a')}
                                        </span>
                                    </div>
                                    <div className="shrink-0">
                                        {renderEnquiryDialog(enquiry)}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default EnquiryManagement;
