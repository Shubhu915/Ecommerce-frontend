"use client";

import React, { useState } from "react";
import AuthLayout from "@/components/features/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/authService";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Lock, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    setLoading(true);
    try {
      await authService.resetPassword(token as string, { password });
      toast.success("Password reset successfully!");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="NEW PASSWORD" subtitle="Update your security credentials.">
      <motion.form 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit} 
        className="space-y-6"
      >
        <div className="space-y-4">
          <div className="space-y-1.5 group">
            <label className="text-[9px] font-black uppercase tracking-widest ml-1 text-slate-400 group-focus-within:text-blue-600 transition-colors">New Password</label>
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
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5 group">
            <label className="text-[9px] font-black uppercase tracking-widest ml-1 text-slate-400 group-focus-within:text-blue-600 transition-colors">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border bg-slate-50 dark:bg-white/5 outline-none focus:ring-4 ring-blue-500/10 border-transparent focus:border-blue-500/50 transition-all font-medium text-sm"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
        </div>

        <Button className="w-full h-14 rounded-2xl text-[10px] font-black tracking-[0.2em] shadow-xl shadow-blue-500/20 group overflow-hidden relative" disabled={loading}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="relative z-10 flex items-center justify-center gap-2">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                RESET PASSWORD <ArrowRight className="w-4 h-4" />
              </>
            )}
          </span>
        </Button>
      </motion.form>
    </AuthLayout>
  );
}
