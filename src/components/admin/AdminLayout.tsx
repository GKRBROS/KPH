import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Image as ImageIcon,
    Users,
    MessageSquare,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Home,
    Settings as SettingsIcon,
    Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navItems = [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
        { name: "Projects", href: "/admin/works", icon: ImageIcon },
        { name: "Workers", href: "/admin/workers", icon: Users },
        { name: "Settings", href: "/admin/settings", icon: SettingsIcon },
    ];

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            toast.success("Logged out successfully");
            navigate("/");
        } catch (error: unknown) {
            toast.error("Failed to logout");
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 bg-black border-b border-zinc-800 z-40 px-4 py-4 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-black text-lg">K</span>
                    </div>
                    <div>
                        <span className="font-black text-lg text-white">KPH Admin</span>
                        <p className="text-[10px] text-zinc-400 font-semibold">Management Panel</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 hover:bg-zinc-800 rounded-xl transition-colors text-white"
                >
                    {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full bg-black border-r border-zinc-800 z-50 transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } w-72 shadow-2xl`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-zinc-800">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                                <span className="text-white font-black text-xl">K</span>
                            </div>
                            <div>
                                <h1 className="font-black text-xl text-white">KPH Paints</h1>
                                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Admin Panel</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        <div className="text-[10px] font-black uppercase tracking-wider text-zinc-500 px-4 mb-3">
                            Main Menu
                        </div>
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`group flex items-center justify-between px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${isActive
                                        ? "bg-primary text-white shadow-lg shadow-red-900/50"
                                        : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className="w-5 h-5" />
                                        <span>{item.name}</span>
                                    </div>
                                    {isActive && <ChevronRight className="w-4 h-4" />}
                                </Link>
                            );
                        })}

                        <div className="pt-6">
                            <div className="text-[10px] font-black uppercase tracking-wider text-zinc-500 px-4 mb-3">
                                Quick Links
                            </div>
                            <Link
                                to="/"
                                className="group flex items-center justify-between px-4 py-3.5 rounded-xl font-bold text-sm text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <Home className="w-5 h-5" />
                                    <span>View Website</span>
                                </div>
                            </Link>
                        </div>
                    </nav>

                    {/* User Profile & Logout */}
                    <div className="p-4 border-t border-zinc-800">
                        <div className="mb-3 p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center">
                                    <span className="text-white font-black text-sm">A</span>
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-sm text-white">Admin User</div>
                                    <div className="text-[10px] text-zinc-400 font-medium">admin@kph.com</div>
                                </div>
                            </div>
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-3 text-zinc-400 hover:text-primary hover:bg-zinc-900 font-bold rounded-xl"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Logout</span>
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Sign out?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to sign out of the admin panel?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleLogout} className="bg-primary hover:bg-red-700 text-white">
                                        Logout
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="lg:ml-72 pt-24 lg:pt-0 min-h-screen bg-slate-50/50">
                <div className="p-4 sm:p-6 lg:p-10 max-w-[1600px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
