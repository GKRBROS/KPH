import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";

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
            <div className="w-full max-w-md mx-auto">
                <div className="bg-white rounded-[40px] shadow-2xl p-10 border border-slate-100">
                    <button
                        onClick={() => setShowForgotPassword(false)}
                        className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-semibold">Back to Login</span>
                    </button>

                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-100">
                            <Mail className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">
                            Forgot Password
                        </h1>
                        <p className="text-slate-400 text-sm font-medium">
                            Enter your email to receive a password reset link
                        </p>
                    </div>

                    <form onSubmit={handleForgotPassword} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="forgot-email" className="text-xs font-black uppercase text-slate-400 tracking-wider">
                                Email Address
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input
                                    id="forgot-email"
                                    type="email"
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    placeholder="admin@kph.com"
                                    required
                                    className="h-14 pl-12 rounded-xl border-slate-200 focus:border-primary transition-colors"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-primary hover:bg-red-700 text-white font-black rounded-xl shadow-lg shadow-red-100 transition-all uppercase tracking-wider"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    Sending...
                                </>
                            ) : (
                                "Send Reset Link"
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-white rounded-[40px] shadow-2xl p-10 border border-slate-100">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-100">
                        <span className="text-white font-black text-2xl">K</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">
                        Admin Login
                    </h1>
                    <p className="text-slate-400 text-sm font-medium">
                        Enter your credentials to access the admin panel
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs font-black uppercase text-slate-400 tracking-wider">
                            Email Address
                        </Label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <Input
                                id="email"
                                type="email"
                                value={loginData.email}
                                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                placeholder="admin@kph.com"
                                required
                                className="h-14 pl-12 rounded-xl border-slate-200 focus:border-primary transition-colors"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-xs font-black uppercase text-slate-400 tracking-wider">
                            Password
                        </Label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={loginData.password}
                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                placeholder="••••••••"
                                required
                                className="h-14 pl-12 pr-12 rounded-xl border-slate-200 focus:border-primary transition-colors"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-sm text-primary hover:text-red-700 font-semibold transition-colors"
                    >
                        Forgot Password?
                    </button>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 bg-primary hover:bg-red-700 text-white font-black rounded-xl shadow-lg shadow-red-100 transition-all uppercase tracking-wider"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                Logging in...
                            </>
                        ) : (
                            "Login to Dashboard"
                        )}
                    </Button>
                </form>

                {/* Footer Note */}
                <div className="mt-8 pt-6 border-t border-slate-100">
                    <p className="text-center text-xs text-slate-400 font-medium">
                        Authorized personnel only. All activities are logged.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
