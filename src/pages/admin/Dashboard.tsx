import AdminLayout from "@/components/admin/AdminLayout";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
    Users,
    MessageSquare,
    Image as ImageIcon,
    Plus,
    ArrowRight,
    Loader2,
    Clock,
    CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

interface Enquiry {
    id: string;
    name: string;
    phone: string;
    district: string;
    interested_in: string;
    status: string;
    created_at: string;
}

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        workers: 0,
        workImages: 0,
        enquiries: 0,
        projects: 0
    });
    const [recentEnquiries, setRecentEnquiries] = useState<Enquiry[]>([]);

    useEffect(() => {
        fetchStats();
        fetchRecentEnquiries();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);

            // Fetch workers count
            const { count: workersCount } = await supabase
                .from('workers')
                .select('*', { count: 'exact', head: true });

            // Fetch work images count
            const { count: imagesCount } = await supabase
                .from('work_images')
                .select('*', { count: 'exact', head: true });

            // Fetch enquiries count
            const { count: enquiriesCount } = await supabase
                .from('enquiries')
                .select('*', { count: 'exact', head: true });

            // Fetch projects count
            const { count: projectsCount } = await supabase
                .from('projects')
                .select('*', { count: 'exact', head: true });

            setStats({
                workers: workersCount || 0,
                workImages: imagesCount || 0,
                enquiries: enquiriesCount || 0,
                projects: projectsCount || 0
            });
        } catch (error: unknown) {
            toast.error("Failed to fetch dashboard stats");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRecentEnquiries = async () => {
        try {
            const { data, error } = await supabase
                .from('enquiries')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);

            if (error) throw error;
            setRecentEnquiries(data || []);
        } catch (error) {
            console.error("Failed to fetch recent enquiries:", error);
        }
    };

    const statsData = [
        {
            label: "Total Enquiries",
            value: stats.enquiries,
            icon: MessageSquare,
            color: "text-slate-700",
            bg: "bg-white",
            border: "border-slate-200"
        },
        {
            label: "Projects",
            value: stats.projects,
            icon: ImageIcon,
            color: "text-slate-700",
            bg: "bg-white",
            border: "border-slate-200"
        },
        {
            label: "Workers",
            value: stats.workers,
            icon: Users,
            color: "text-slate-700",
            bg: "bg-white",
            border: "border-slate-200"
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'New':
                return 'bg-primary/10 text-primary';
            case 'In Progress':
                return 'bg-blue-100 text-blue-700';
            case 'Completed':
                return 'bg-green-100 text-green-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInHours < 48) return 'Yesterday';
        return date.toLocaleDateString();
    };

    return (
        <AdminLayout>
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900">
                            Dashboard
                        </h1>
                    </div>
                    <div className="hidden md:flex items-center gap-3">
                        <Button asChild variant="outline" className="gap-2 border-slate-300 hover:bg-slate-100">
                            <Link to="/admin/enquiries">
                                <MessageSquare className="w-4 h-4" />
                                View Enquiries
                            </Link>
                        </Button>
                        <Button asChild className="gap-2 bg-primary hover:bg-red-700">
                            <Link to="/admin/works">
                                <Plus className="w-4 h-4" />
                                Add Project
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                        {statsData.map((stat) => (
                            <Card key={stat.label} className={`p-6 ${stat.bg} border-2 ${stat.border} shadow-sm hover:shadow-md transition-all duration-300`}>
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center ${stat.color}`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
                                    <div className="text-xs text-slate-600 font-semibold uppercase tracking-wide">{stat.label}</div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 gap-6 mb-8">
                        {/* Recent Enquiries */}
                        <Card className="p-6 bg-white border-2 border-slate-200 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-primary" />
                                    Recent Enquiries
                                </h2>
                                <Button asChild variant="ghost" size="sm" className="text-primary hover:text-red-700 hover:bg-red-50">
                                    <Link to="/admin/enquiries" className="flex items-center gap-1">
                                        View All
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {recentEnquiries.length > 0 ? (
                                    recentEnquiries.map((enquiry) => (
                                        <div key={enquiry.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200 gap-4 sm:gap-0">
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between sm:block">
                                                    <div className="font-bold text-slate-900 mb-1">{enquiry.name}</div>
                                                    <span className="text-xs text-slate-400 font-medium whitespace-nowrap sm:hidden">
                                                        {formatDate(enquiry.created_at)}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2 sm:gap-3">
                                                    <span>{enquiry.phone}</span>
                                                    <span className="hidden sm:inline">•</span>
                                                    <span>{enquiry.district}</span>
                                                    <span className="hidden sm:inline">•</span>
                                                    <span>{enquiry.interested_in}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between sm:justify-end gap-3">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(enquiry.status)}`}>
                                                    {enquiry.status}
                                                </span>
                                                <span className="text-xs text-slate-400 font-medium whitespace-nowrap hidden sm:block">
                                                    {formatDate(enquiry.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-slate-400">
                                        <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p className="text-sm font-medium">No enquiries yet</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Action Cards Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Manage Projects */}
                        <Card className="p-8 bg-white border-2 border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary">
                            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-6">
                                <ImageIcon className="w-7 h-7 text-slate-700" />
                            </div>
                            <h2 className="text-2xl font-black uppercase mb-3 tracking-tight text-slate-900">Manage Projects</h2>
                            <p className="text-slate-600 text-sm font-medium leading-relaxed mb-6">
                                Upload and manage your completed painting project images.
                            </p>
                            <Button asChild className="w-full bg-primary hover:bg-red-700 text-white font-black py-6 rounded-xl">
                                <Link to="/admin/works" className="flex items-center justify-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    Add Project
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </Button>
                        </Card>

                        {/* Manage Workers */}
                        <Card className="p-8 bg-white border-2 border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary">
                            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-6">
                                <Users className="w-7 h-7 text-slate-700" />
                            </div>
                            <h2 className="text-2xl font-black uppercase mb-3 tracking-tight text-slate-900">Manage Workers</h2>
                            <p className="text-slate-600 text-sm font-medium leading-relaxed mb-6">
                                Add, edit, and manage your painting staff details.
                            </p>
                            <Button asChild className="w-full bg-primary hover:bg-red-700 text-white font-black py-6 rounded-xl">
                                <Link to="/admin/workers" className="flex items-center justify-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    Add Worker
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </Button>
                        </Card>

                        {/* View Enquiries */}
                        <Card className="p-8 bg-white border-2 border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary">
                            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-6">
                                <MessageSquare className="w-7 h-7 text-slate-700" />
                            </div>
                            <h2 className="text-2xl font-black uppercase mb-3 tracking-tight text-slate-900">Enquiries</h2>
                            <p className="text-slate-600 text-sm font-medium leading-relaxed mb-6">
                                Track new leads and manage customer interactions.
                            </p>
                            <Button asChild className="w-full bg-primary hover:bg-red-700 text-white font-black py-6 rounded-xl">
                                <Link to="/admin/enquiries" className="flex items-center justify-center gap-2">
                                    View All
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </Button>
                        </Card>
                    </div>
                </>
            )}
        </AdminLayout>
    );
};

export default Dashboard;
