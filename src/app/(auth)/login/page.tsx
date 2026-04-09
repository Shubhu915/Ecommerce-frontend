"use client";

import React, { useState } from "react";
import AuthLayout from "@/components/features/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.login({ email, password });
      const { user, accessToken } = res.data || res;
      setAuth(user, accessToken);
      toast.success("Welcome back!");
      router.push(user.role === "admin" ? "/admin" : "/");
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="WELCOME BACK" subtitle="Access your AI-powered shopping experience.">
      <motion.form 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onSubmit={handleLogin} 
        className="space-y-6"
      >
        <div className="space-y-4">
          <div className="space-y-1.5 group">
            <label className="text-[9px] font-black uppercase tracking-widest ml-1 text-slate-400 group-focus-within:text-blue-600 transition-colors">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border bg-slate-50 dark:bg-white/5 outline-none focus:ring-4 ring-blue-500/10 border-transparent focus:border-blue-500/50 transition-all font-medium text-sm"
                placeholder="name@example.com"
                required
              />
            </div>
          </div>
          
          <div className="space-y-1.5 group">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-focus-within:text-blue-600 transition-colors">Password</label>
              <button 
                type="button"
                onClick={() => toast.info("Password recovery coming soon!")}
                className="text-[9px] font-black uppercase tracking-widest text-blue-600 hover:underline"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 rounded-2xl border bg-slate-50 dark:bg-white/5 outline-none focus:ring-4 ring-blue-500/10 border-transparent focus:border-blue-500/50 transition-all font-medium text-sm"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between ml-1">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <div className="relative">
              <input type="checkbox" className="peer sr-only" id="remember" />
              <div className="w-4.5 h-4.5 rounded-md border-2 border-slate-200 dark:border-slate-800 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all" />
              <ShieldCheck className="absolute top-0.5 left-0.5 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-600 transition-colors">Remember my device</span>
          </label>
        </div>

        <Button className="w-full h-14 rounded-2xl text-[10px] font-black tracking-[0.2em] shadow-xl shadow-blue-500/20 group overflow-hidden relative" disabled={loading}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="relative z-10 flex items-center justify-center gap-2">
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                SIGNING...
              </>
            ) : (
              <>
                SIGN IN <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </span>
        </Button>

        <div className="relative flex items-center gap-3 py-1">
          <div className="flex-1 h-[1px] bg-slate-100 dark:bg-white/5" />
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">OR</span>
          <div className="flex-1 h-[1px] bg-slate-100 dark:bg-white/5" />
        </div>

        <div className="grid grid-cols-2 gap-3">
           <Button 
            onClick={() => toast.info("Google login coming soon!")}
            variant="outline" type="button" className="h-12 rounded-2xl border-2 font-black text-[9px] tracking-widest gap-2.5 hover:bg-slate-50 dark:hover:bg-white/5"
           >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              GOOGLE
           </Button>
           <Button 
            onClick={() => toast.info("Apple ID login coming soon!")}
            variant="outline" type="button" className="h-12 rounded-2xl border-2 font-black text-[9px] tracking-widest gap-2.5 hover:bg-slate-50 dark:hover:bg-white/5"
           >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M17.05 20.28c-.98.95-2.05 1.72-3.21 2.3l-.33.16c-1.25.61-2.58.91-3.95.91-1.35 0-2.66-.29-3.88-.86l-.37-.18c-1.13-.56-2.17-1.3-3.08-2.21-1.84-1.84-2.76-4.08-2.76-6.68 0-2.6.92-4.84 2.76-6.68.91-.91 1.95-1.65 3.08-2.21l.37-.18C7.14.86 8.45.57 9.8.57c1.37 0 2.7.3 3.95.91l.33.16c1.16.58 2.23 1.35 3.21 2.3l.66.66c-.1.1-.22.21-.34.33-.87.87-1.31 1.93-1.31 3.16s.44 2.29 1.31 3.16c.12.12.24.23.34.33l-.9-.9c-.87-.87-1.93-1.31-3.16-1.31s-2.29.44-3.16 1.31c-.12.12-.23.24-.33.34l.9-.9c.87.87 1.93 1.31 1.31 3.16s-.44 2.29-1.31 3.16c-.12.12-.24.23-.34.33l.9-.9c.87.87 1.93 1.31 3.16 1.31s2.29-.44 3.16-1.31c.1.1.22.21.34.33l-.66.66z" />
              </svg>
              APPLE ID
           </Button>
        </div>
      </motion.form>
      
      <div className="mt-10">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          New to AI.Store? 
          <a href="/register" className="ml-2 text-blue-600 hover:underline">Get started for free</a>
        </p>
      </div>
    </AuthLayout>
  );
}
