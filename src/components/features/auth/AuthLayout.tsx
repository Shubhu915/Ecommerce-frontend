"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Sparkles, ArrowLeft, ShieldCheck, Zap, ShoppingBag, Star, Search, Tag, Bot } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";

const typingTexts = [
  "Find trending sneakers...",
  "Best gifts under ₹1999...",
  "AI-picked for you...",
  "Latest tech gadgets...",
];

export default function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % typingTexts.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white dark:bg-[#050505] selection:bg-blue-600 selection:text-white overflow-hidden">
      {/* Left Panel: AI Shopping Assistant Visuals */}
      <div className="hidden lg:flex relative overflow-hidden bg-slate-900 items-center justify-center">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 z-0">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: -1 }}
            className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-600/20 blur-[120px] rounded-full" 
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{ duration: 15, repeat: -1 }}
            className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-purple-600/20 blur-[120px] rounded-full" 
          />
        </div>

        <div className="relative z-10 w-full max-w-xl px-10 space-y-8">
          {/* Brand Logo */}
          <Link href="/" className="inline-flex items-center gap-2.5 group">
             <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-blue-500/30 group-hover:scale-110 transition-all duration-500 ring-2 ring-blue-500/10">
                <Sparkles className="w-5 h-5" />
             </div>
             <span className="text-2xl font-black tracking-tighter text-white">AI<span className="text-blue-500 italic">.</span>STORE</span>
          </Link>

          {/* Heading Area */}
          <div className="space-y-4">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl lg:text-6xl font-black text-white leading-[0.9] tracking-tighter"
            >
              SHOP <br /> <span className="text-blue-500 italic">SMARTER</span> <br /> WITH AI.
            </motion.h2>
            
            <div className="h-6 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={textIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="text-blue-200/60 text-base font-medium tracking-tight"
                >
                  {typingTexts[textIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            <p className="text-slate-400 text-sm max-w-sm font-medium leading-relaxed">
              Personalized recommendations, faster search, and a better shopping experience.
            </p>
          </div>

          {/* Floating Elements Container - Reduced Height */}
          <div className="relative h-[300px] w-full mt-6 scale-90">
            {/* Main Product Card */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: -1, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-56 p-3 bg-white/10 backdrop-blur-3xl rounded-[2rem] border border-white/10 shadow-2xl ring-1 ring-white/20"
            >
              <div className="aspect-square rounded-xl bg-slate-800 mb-3 overflow-hidden relative">
                 <Image 
                   src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400" 
                   alt="Featured" 
                   fill 
                   className="object-cover"
                 />
                 <div className="absolute top-2 right-2 bg-blue-600 px-1.5 py-0.5 rounded text-[7px] font-black text-white uppercase tracking-widest">
                   AI PICK
                 </div>
              </div>
              <div className="space-y-0.5">
                <div className="flex justify-between items-center">
                  <span className="text-[7px] font-black text-blue-400 uppercase tracking-widest">Footwear</span>
                  <div className="flex gap-0.5"><Star className="w-1.5 h-1.5 text-amber-500 fill-current" /> <span className="text-[7px] text-white">4.9</span></div>
                </div>
                <p className="text-xs font-bold text-white">Air Max Pro XL</p>
                <p className="text-[10px] font-black text-white">₹14,999</p>
              </div>
            </motion.div>

            {/* AI Suggestion Bubble */}
             <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 5, repeat: -1, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-10 right-0 w-40 p-3 bg-blue-600/20 backdrop-blur-3xl rounded-2xl border border-blue-500/30 shadow-2xl flex gap-2 items-center"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[8px] font-black text-blue-400 uppercase tracking-tight leading-none mb-0.5">AI SUGGESTION</p>
                <p className="text-[10px] font-bold text-white leading-tight">Try blue laces.</p>
              </div>
            </motion.div>

            {/* Cart Preview Card */}
            <motion.div
              animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
              transition={{ duration: 6, repeat: -1, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-5 left-10 w-48 p-3 bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-white"><ShoppingBag className="w-5 h-5" /></div>
              <div className="flex-1">
                <div className="h-1.5 w-12 bg-white/20 rounded-full mb-1.5" />
                <div className="h-1.5 w-8 bg-white/10 rounded-full" />
              </div>
              <div className="text-right">
                <p className="text-[8px] font-black text-blue-400">₹24,998</p>
              </div>
            </motion.div>

            {/* Discount Badge */}
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
              transition={{ duration: 3, repeat: -1, ease: "easeInOut", delay: 1.5 }}
              className="absolute bottom-32 right-5 w-16 h-16 bg-purple-600 rounded-full flex flex-col items-center justify-center text-white shadow-2xl shadow-purple-500/40 border-[3px] border-slate-900"
            >
                <Tag className="w-3 h-3 mb-0.5" />
                <span className="text-[8px] font-black tracking-tighter leading-none">SAVE</span>
                <span className="text-base font-black leading-none">20%</span>
            </motion.div>
          </div>

          {/* Trust Badges - Reduced Spacing */}
          <div className="pt-8 border-t border-white/10 flex items-center gap-6">
            <div className="flex items-center gap-2">
               <ShieldCheck className="w-5 h-5 text-blue-500" />
               <p className="text-[8px] font-black text-white uppercase tracking-widest leading-none">Secure <br /> Checkout</p>
            </div>
            <div className="flex items-center gap-2">
               <Zap className="w-5 h-5 text-blue-500" />
               <p className="text-[8px] font-black text-white uppercase tracking-widest leading-none">Lightning <br /> Speed</p>
            </div>
            <div className="flex items-center gap-2">
               <Sparkles className="w-5 h-5 text-blue-500" />
               <p className="text-[8px] font-black text-white uppercase tracking-widest leading-none">Smart <br /> Insights</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Content (Forms) */}
      <div className="flex flex-col relative overflow-y-auto">
        {/* Mobile Header (Brand Only) */}
        <div className="lg:hidden p-6 flex items-center justify-center bg-slate-900">
           <Link href="/" className="inline-flex items-center gap-2">
             <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <Sparkles className="w-3.5 h-3.5" />
             </div>
             <span className="text-lg font-black tracking-tighter text-white uppercase italic">AI.STORE</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
          <Link href="/" className="absolute top-8 left-8 lg:left-12 inline-flex items-center gap-2 text-[9px] font-black tracking-widest text-slate-400 hover:text-blue-600 transition-colors uppercase group">
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Back to Shop
          </Link>

          <div className="w-full max-w-sm lg:max-w-[420px] space-y-7 py-6">
            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-black tracking-tighter leading-none dark:text-white uppercase transition-all duration-500">{title}</h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-base leading-relaxed tracking-tight">{subtitle}</p>
            </div>

            <div className="relative">
              {children}
            </div>
            
            <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-center gap-2">
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Protected by AI Guard 2.0</span>
               <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
