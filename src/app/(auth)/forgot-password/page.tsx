"use client";

import React, { useState } from "react";
import AuthLayout from "@/components/features/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/authService";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
      toast.success("Reset link sent!");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="RESET SECURITY" subtitle="Recover access to your AI.Store account.">
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.form 
            key="forgot-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit} 
            className="space-y-6"
          >
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

            <Button className="w-full h-14 rounded-2xl text-[10px] font-black tracking-[0.2em] shadow-xl shadow-blue-500/20 group overflow-hidden relative" disabled={loading}>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    SEND RESET LINK <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </span>
            </Button>

            <Link href="/login" className="flex items-center justify-center text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">
              Back to Login
            </Link>
          </motion.form>
        ) : (
          <motion.div
            key="success-msg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 py-8"
          >
            <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight">Check your inbox</h2>
            <p className="text-slate-500 max-w-xs mx-auto">We've sent a secure reset link to **{email}**. Please check your spam folder if you don't see it.</p>
            <Button variant="outline" className="w-full h-14 rounded-2xl font-black tracking-widest" onClick={() => setSubmitted(false)}>
              TRY ANOTHER EMAIL
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}

import { AnimatePresence } from "framer-motion";
