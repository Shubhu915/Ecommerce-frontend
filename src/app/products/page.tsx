"use client";

import React, { useState, Suspense } from "react";
import { Header } from "@/components/common/Header";
import { ProductCard } from "@/components/common/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/productService";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, fadeIn } from "@/lib/animations";
import { Filter, SlidersHorizontal, Search as SearchIcon, ArrowDownWideNarrow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const sampleProducts = [
    { id: "1", name: "Nike Air Max 270", price: 12999, category: "Footwear", images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800"], stock: 10, description: "Classic comfort." },
    { id: "2", name: "Apple Watch Series 9", price: 41900, category: "Electronics", images: ["https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=800"], stock: 5, description: "Stay connected." },
    { id: "3", name: "Sony WH-1000XM5", price: 29990, category: "Audio", images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800"], stock: 8, description: "Perfect noise cancellation." },
    { id: "4", name: "Dior Sauvage Parfum", price: 14500, category: "Fragrance", images: ["https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800"], stock: 12, description: "Bold and fresh." },
    { id: "5", name: "Modern Desk Lamp", price: 2499, category: "Home", images: ["https://images.unsplash.com/photo-1534073828943-f801091bb18c?q=80&w=800"], stock: 20, description: "Minimalist lighting." },
    { id: "6", name: "Leather Tote Bag", price: 5999, category: "Fashion", images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800"], stock: 15, description: "Elegant everyday bag." },
  ];

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const router = useRouter();
  
  // Debounce search update to URL
  React.useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchQuery) params.set("q", searchQuery);
      else params.delete("q");
      router.push(`/products?${params.toString()}`, { scroll: false });
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery, router, searchParams]);

  const { data, isLoading } = useQuery({
    queryKey: ["products", searchQuery],
    queryFn: async () => {
      // res is ApiResponse<SearchResponse>
      const res = searchQuery ? await productService.search(searchQuery) : await productService.getAll();
      const payload = res.data || res;
      return Array.isArray(payload) ? payload : payload.data;
    },
  });

  const products = (data && data.length > 0) ? data : (searchQuery === "" ? sampleProducts : []);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-slate-900 dark:text-white">
      <Header />
      
      <main className="container mx-auto px-6 pt-32 pb-24">
        {/* Header Section */}
        <div className="relative mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-none">
              THE <span className="text-blue-600">COLLECTION</span>
            </h1>
            <p className="text-slate-500 text-lg max-w-xl">
              Explore our meticulously curated selection of products, powered by AI to match your unique style.
            </p>
          </motion.div>

          {/* Background Decorative Blur */}
          <div className="absolute -top-10 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] -z-10 rounded-full" />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row justify-between items-center bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-4 rounded-[2.5rem] mb-12 gap-4 shadow-xl shadow-slate-200/20 dark:shadow-none">
          <div className="flex items-center gap-2 flex-1 w-full lg:w-auto">
            <div className="relative flex-1 max-w-md">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Find something special..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 dark:bg-white/5 border-transparent focus:border-blue-500/50 rounded-2xl py-3 pl-12 pr-4 outline-none transition-all font-medium text-sm"
              />
            </div>
            <Button 
              onClick={() => toast.info("AI-powered refining coming soon!")}
              variant="secondary" className="rounded-2xl h-12 px-6 font-bold gap-2"
            >
              <ArrowDownWideNarrow className="w-4 h-4" />
              <span>REFINE</span>
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-4">
              {products.length} Items Found
            </p>
            <Button 
              onClick={() => toast.info("Advanced filtering coming soon!")}
              variant="outline" className="rounded-2xl border-2 gap-2 h-12 px-6"
            >
              <Filter className="w-4 h-4" /> 
              <span>FILTER</span>
            </Button>
            <Button 
              onClick={() => toast.info("Sorting features coming soon!")}
              variant="outline" className="rounded-2xl border-2 gap-2 h-12 px-6"
            >
              <SlidersHorizontal className="w-4 h-4" /> 
              <span>SORT</span>
            </Button>
          </div>
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
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="aspect-[4/5] bg-slate-100 dark:bg-slate-900 rounded-[2.5rem] animate-pulse relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                </div>
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
                <motion.div key={product.id} variants={fadeIn}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-40 bg-white/50 dark:bg-white/5 backdrop-blur-md rounded-[3rem] border border-dashed border-slate-300 dark:border-slate-800"
            >
              <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <SearchIcon className="w-10 h-10 text-slate-300" />
              </div>
              <h2 className="text-3xl font-black mb-2 tracking-tight">QUIET IN HERE.</h2>
              <p className="text-slate-500 max-w-xs mx-auto">We couldn't find any products matching your search. Try broadening your terms.</p>
              <Button 
                variant="link" 
                onClick={() => setSearchQuery("")}
                className="mt-6 font-black text-blue-600 uppercase tracking-widest"
              >
                Clear All Filters
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
