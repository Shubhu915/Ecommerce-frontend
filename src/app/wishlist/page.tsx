"use client";

import React from "react";
import { Header } from "@/components/common/Header";
import { ProductCard } from "@/components/common/ProductCard";
import { wishlistService } from "@/services/wishlistService";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, fadeIn } from "@/lib/animations";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
  const router = useRouter();
  const { data: wishlistRes, isLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => wishlistService.getWishlist(),
  });

  const products = wishlistRes?.data || [];

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-slate-900 dark:text-white">
      <Header />
      
      <main className="container mx-auto px-6 pt-32 pb-24">
        {/* Header Section */}
        <div className="relative mb-20 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h1 className="text-5xl lg:text-8xl font-black tracking-tighter leading-none">
              SAVED <span className="text-blue-600 italic">TREASURES</span>
            </h1>
            <p className="text-slate-500 text-lg max-w-xl lg:mx-0 mx-auto uppercase font-black tracking-widest text-xs opacity-60">
              {products.length} ITEMS SAVED IN YOUR AI WISHLIST
            </p>
          </motion.div>
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-10"
            >
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[4/5] bg-slate-100 dark:bg-slate-900 rounded-[2.5rem] animate-pulse" />
              ))}
            </motion.div>
          ) : products.length > 0 ? (
            <motion.div
              key="grid"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-10"
            >
              {products.map((product: any) => (
                <motion.div key={product._id} variants={fadeIn}>
                   <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-40 bg-white/50 dark:bg-white/5 backdrop-blur-md rounded-[4rem] border border-dashed border-slate-300 dark:border-slate-800"
            >
              <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <Heart className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-4xl font-black mb-4 tracking-tight uppercase">EMPTY WHISPERS.</h2>
              <p className="text-slate-500 max-w-sm mx-auto font-medium">Your wishlist is waiting for its first item. Explore our AI-curated collection to find your next obsession.</p>
              <Button 
                onClick={() => router.push('/products')}
                className="mt-10 h-16 px-10 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] bg-blue-600 shadow-2xl shadow-blue-500/30 gap-3"
              >
                BROWSE PRODUCTS <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
