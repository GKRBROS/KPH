import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Sparkles, ShieldCheck } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 relative overflow-hidden">

      {/* Premium Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large Architectural Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-black text-[25vw] text-slate-50 select-none opacity-60 tracking-tighter uppercase leading-none">
          ADMIN
        </div>

        {/* Subtle Gradient Glows */}
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="w-full max-w-[1200px] grid lg:grid-cols-2 gap-12 lg:gap-24 relative z-10 items-center">

        {/* Left Side: Branding & Context */}
        <div className="hidden lg:flex flex-col space-y-12">
          <Link
            to="/"
            className="inline-flex items-center gap-4 text-slate-400 hover:text-primary transition-all group w-fit"
          >
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
            <span className="font-heading text-[10px] font-black uppercase tracking-[0.4em]">Return to Website</span>
          </Link>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-primary" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Official Portal</span>
            </div>
            <h1 className="text-6xl xl:text-8xl font-heading font-black tracking-tighter text-slate-900 leading-[0.85] uppercase">
              Secure <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-slate-400 to-primary">Access</span>
            </h1>
            <p className="text-slate-500 text-lg font-medium max-w-md leading-relaxed">
              Welcome back to the Kalangara Paint House management system. Access your dashboard to manage inventory, projects, and enquiries.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-6">
            <div className="space-y-3">
              <div className="w-10 h-10 bg-slate-50 flex items-center justify-center border border-slate-100">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Encrypted</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase leading-tight">256-bit Secure Authentication</p>
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 bg-slate-50 flex items-center justify-center border border-slate-100">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Modern</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase leading-tight">Unified Design Experience</p>
            </div>
          </div>
        </div>

        {/* Right Side: The Login Form */}
        <div className="w-full flex justify-center lg:justify-end">
          <div className="w-full max-w-[440px]">
            {/* Mobile-only back button */}
            <Link
              to="/"
              className="lg:hidden inline-flex items-center gap-2 text-slate-400 hover:text-primary mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
            </Link>

            <LoginForm />
          </div>
        </div>
      </div>

      {/* Bottom Legal/Version Bar */}
      <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row justify-between items-center gap-4 opacity-30 select-none">
        <span className="text-[8px] font-black uppercase tracking-[0.5em]">KPH v2.0.4 — Build Stable</span>
        <span className="text-[8px] font-black uppercase tracking-[0.5em]">© {new Date().getFullYear()} Authorized Access Only</span>
      </div>
    </div>
  );
};

export default Login;
