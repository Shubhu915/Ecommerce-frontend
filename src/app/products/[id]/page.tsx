"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/common/Header";
import { productService } from "@/services/productService";
import { userService } from "@/services/userService";
import { cartService } from "@/services/cartService";
import { wishlistService } from "@/services/wishlistService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  ChevronRight, 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Plus,
  Minus
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { ProductCard } from "@/components/common/ProductCard";
import { staggerContainer, fadeIn } from "@/lib/animations";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const queryClient = useQueryClient();

  const { data: productRes, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productService.getById(id as string),
  });

  const product = productRes?.data || productRes;

  const { data: recommendationsRes } = useQuery({
    queryKey: ["recommendations"],
    queryFn: () => userService.getRecommendations(),
    enabled: !!product, // Fetch after product loads
  });

  const recommendations = recommendationsRes?.data || [];

  // Track View on Mount
  useEffect(() => {
    if (id) {
      userService.trackView(id as string).catch(() => {});
    }
  }, [id]);

  const addToCartMutation = useMutation({
    mutationFn: () => cartService.addToCart(id as string, quantity),
    onSuccess: () => {
      toast.success("Added to cart!");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to add to cart");
    }
  });

  const toggleWishlistMutation = useMutation({
    mutationFn: () => (wishlistService as any).toggleWishlist(id as string),
    onSuccess: () => {
      toast.success("Wishlist updated!");
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update wishlist");
    }
  });

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center text-center">
    <h1 className="text-3xl font-black">Product Not Found</h1>
    <Button onClick={() => window.history.back()} className="mt-4">Go Back</Button>
  </div>;

  const images = product.images || [];

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-slate-900 dark:text-white">
      <Header />
      
      <main className="container mx-auto px-6 pt-32 pb-24">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-12 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <a href="/" className="hover:text-blue-600">Home</a>
          <ChevronRight className="w-3 h-3" />
          <a href="/products" className="hover:text-blue-600">Products</a>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-900 dark:text-white">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* Images Section */}
          <div className="space-y-6">
            <motion.div 
              layoutId={`img-${id}`}
              className="relative aspect-square rounded-[3rem] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/5 shadow-2xl shadow-slate-200/50 dark:shadow-none"
            >
              <Image 
                src={images[activeImage]?.url || images[activeImage] || "/placeholder.jpg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </motion.div>
            
            <div className="grid grid-cols-4 gap-4">
              {images.map((img: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                    activeImage === idx ? "border-blue-600 scale-95" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={img.url || img} alt={product.name} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="px-3 py-1.5 bg-blue-500/10 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-amber-500 font-black text-xs">
                  <Star className="w-4 h-4 fill-current" />
                  {product.ratings} ({product.numReviews} Reviews)
                </div>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[0.9]">
                {product.name}
              </h1>
              
              <p className="text-4xl font-black text-blue-600 mt-4">
                ₹{product.price.toLocaleString()}
              </p>
            </div>

            <div className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed max-w-xl">
              {product.description}
            </div>

            {/* AI Intelligence Badge */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-600/5 to-indigo-600/5 border border-blue-600/10 backdrop-blur-sm flex items-center gap-6">
               <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20">
                  <Star className="w-8 h-8 text-white fill-white" />
               </div>
               <div>
                  <p className="text-xs font-black uppercase tracking-widest text-blue-600">AI Intelligence</p>
                  <p className="text-sm font-medium text-slate-500">Optimized pricing and personalized fit ready for you.</p>
               </div>
            </div>

            {/* Actions */}
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="flex items-center bg-slate-100 dark:bg-white/5 rounded-2xl p-1.5">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-xl h-10 w-10 hover:bg-white dark:hover:bg-white/10"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-black text-lg">{quantity}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-xl h-10 w-10 hover:bg-white dark:hover:bg-white/10"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                <Button 
                  onClick={() => addToCartMutation.mutate()}
                  className="flex-1 h-16 rounded-2xl text-[12px] font-black tracking-[0.2em] shadow-2xl shadow-blue-600/30 gap-3"
                  disabled={addToCartMutation.isPending}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {addToCartMutation.isPending ? "ADDING..." : "ADD TO CART"}
                </Button>
                
                <Button 
                  onClick={() => toggleWishlistMutation.mutate()}
                  variant="outline" className="h-16 w-16 rounded-2xl border-2 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all"
                >
                  <Heart className={`w-6 h-6 ${toggleWishlistMutation.isPending ? "animate-pulse" : ""}`} />
                </Button>
                
                <Button 
                  onClick={handleShare}
                  variant="outline" className="h-16 w-16 rounded-2xl border-2"
                >
                  <Share2 className="w-6 h-6" />
                </Button>
              </div>
            </div>

            {/* Value Props */}
            <div className="grid grid-cols-3 gap-6 pt-10 border-t border-slate-100 dark:border-white/5">
              {[
                { icon: Truck, title: "Fast Delivery", text: "2-3 Days" },
                { icon: ShieldCheck, title: "Genuine Prod", text: "100% Quality" },
                { icon: RotateCcw, title: "Easy Return", text: "30-Day Window" }
              ].map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <item.icon className="w-6 h-6 text-slate-400" />
                  <p className="font-black text-[10px] uppercase tracking-widest">{item.title}</p>
                  <p className="text-[10px] text-slate-500">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Recommendations Section */}
        {recommendations.length > 0 && (
          <section className="mt-40">
            <div className="flex justify-between items-end mb-16">
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl font-black tracking-tighter">AI <span className="text-blue-600 italic">PERSONALIZED</span> FOR YOU</h2>
                <p className="text-slate-500 text-lg max-w-md">Based on your browsing history and the {product.name}.</p>
              </div>
            </div>
            
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-10"
            >
              {recommendations.slice(0, 4).map((rec: any) => (
                <motion.div key={rec._id} variants={fadeIn}>
                  <ProductCard product={rec} />
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}
      </main>
    </div>
  );
}
