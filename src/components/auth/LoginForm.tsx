import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, ArrowLeft, Eye, EyeOff, KeyRound, ShieldCheck, ArrowUpRight } from "lucide-react";

const LoginForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });
    const [forgotEmail, setForgotEmail] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);

            const { data, error } = await supabase.auth.signInWithPassword({
                email: loginData.email,
                password: loginData.password,
            });

            if (error) throw error;

            if (data.user) {
                toast.success("Login successful!");
                navigate("/admin/dashboard");
            }
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : "Failed to login";
            toast.error(errorMessage);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);

            const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
                redirectTo: `${window.location.origin}/admin/reset-password`,
            });

            if (error) throw error;

            toast.success("Password reset email sent! Please check your inbox.");
            setShowForgotPassword(false);
            setForgotEmail("");
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : "Failed to send reset email";
            toast.error(errorMessage);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (showForgotPassword) {
        return (
            <div className="w-full bg-white border border-slate-900 shadow-[20px_20px_0px_0px_theme(colors.primary.DEFAULT)] p-8 md:p-12 relative overflow-hidden group">
                <button
                    onClick={() => setShowForgotPassword(false)}
                    className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors mb-8 group/back"
                >
                    <ArrowLeft className="w-4 h-4 group-hover/back:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Back to Login</span>
                </button>

                <div className="mb-10">
                    <div className="w-12 h-12 bg-slate-900 text-white flex items-center justify-center mb-6">
                        <KeyRound className="w-6 h-6 text-primary" />
                    </div>
                    <h1 className="text-3xl font-heading font-black text-slate-900 mb-2 uppercase tracking-tighter">
                        Reset Access
                    </h1>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wide">
                        Enter your management email address
                    </p>
                </div>

                <form onSubmit={handleForgotPassword} className="space-y-8">
                    <div className="space-y-3">
                        <Label htmlFor="forgot-email" className="text-[10px] font-black uppercase text-slate-900 tracking-[0.2em]">
                            Email Address
                        </Label>
                        <div className="relative group/input">
                            <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-primary scale-y-0 group-focus-within/input:scale-y-100 transition-transform origin-top z-10" />
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                id="forgot-email"
                                type="email"
                                value={forgotEmail}
                                onChange={(e) => setForgotEmail(e.target.value)}
                                placeholder="name@kph.com"
                                required
                                className="h-14 pl-12 rounded-none border-slate-200 focus:border-slate-900 transition-all font-medium"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-16 bg-slate-900 hover:bg-primary text-white font-black rounded-none shadow-xl transition-all uppercase tracking-[0.3em] text-[10px]"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            "Request New Password"
                        )}
                    </Button>
                </form>
            </div>
        );
    }

    return (
        <div className="w-full bg-white border border-slate-900 shadow-[20px_20px_0px_0px_theme(colors.primary.DEFAULT)] p-8 md:p-12 relative overflow-hidden group">
            {/* Header Identity */}
            <div className="flex justify-between items-start mb-12">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">System Identity</span>
                    </div>
                    <h1 className="text-4xl font-heading font-black text-slate-900 uppercase tracking-tighter">
                        Login
                    </h1>
                </div>
                <div className="w-12 h-12 bg-primary text-white flex items-center justify-center font-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                    KPH
                </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-8">
                <div className="space-y-3">
                    <Label htmlFor="email" className="text-[10px] font-black uppercase text-slate-900 tracking-[0.2em]">
                        Email Address
                    </Label>
                    <div className="relative group/input">
                        <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-primary scale-y-0 group-focus-within/input:scale-y-100 transition-transform origin-top z-10" />
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            id="email"
                            type="email"
                            value={loginData.email}
                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                            placeholder="name@kph.com"
                            required
                            className="h-14 pl-12 rounded-none border-slate-200 focus:border-slate-900 transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <Label htmlFor="password" className="text-[10px] font-black uppercase text-slate-900 tracking-[0.2em]">
                            Password
                        </Label>
                        <button
                            type="button"
                            onClick={() => setShowForgotPassword(true)}
                            className="text-[10px] text-primary hover:text-slate-900 font-black uppercase tracking-widest transition-colors"
                        >
                            Forgot?
                        </button>
                    </div>
                    <div className="relative group/input">
                        <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-primary scale-y-0 group-focus-within/input:scale-y-100 transition-transform origin-top z-10" />
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={loginData.password}
                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                            placeholder="••••••••"
                            required
                            className="h-14 pl-12 pr-12 rounded-none border-slate-200 focus:border-slate-900 transition-all font-medium"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-16 bg-slate-900 hover:bg-primary text-white font-black rounded-none shadow-xl transition-all uppercase tracking-[0.3em] text-[10px] relative mt-4 overflow-hidden group/btn"
                >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Authenticate Access
                                <ArrowUpRight className="w-4 h-4 group-hover/btn:rotate-45 transition-transform" />
                            </>
                        )}
                    </span>
                    <div className="absolute inset-0 bg-primary translate-y-[100%] group-hover/btn:translate-y-0 transition-transform duration-300 pointer-events-none" />
                </Button>
            </form>

            {/* Security Footer */}
            <div className="mt-12 pt-8 border-t border-slate-100 flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                </div>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                    Personalized access strictly monitored. <br />
                    Session valid for 24 hours.
                </p>
            </div>
        </div>
    );
};

export default LoginForm;
