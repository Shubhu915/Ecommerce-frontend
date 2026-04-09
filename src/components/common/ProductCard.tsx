"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star, Eye } from "lucide-react";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cartService } from "@/services/cartService";
import { wishlistService } from "@/services/wishlistService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { env } from "@/config/env";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Use a derived online image or placeholder
  const imageUrl = (typeof product.images[0] === 'string' 
    ? product.images[0] 
    : product.images[0]?.url) || `https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop`;

  const productId = product._id || (product as any).id;

  const addToCartMutation = useMutation({
    mutationFn: () => cartService.addToCart(productId, 1),
    onSuccess: () => {
      toast.success("Added to cart!");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Login to add items");
    }
  });

  const toggleWishlistMutation = useMutation({
    mutationFn: () => wishlistService.toggleWishlist(productId),
    onSuccess: () => {
      toast.success("Updated wishlist!");
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update wishlist");
    }
  });

  return (
    <motion.div
      whileHover={{ y: -10 }}
      layout
      className="group relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] border border-white/20 dark:border-slate-800/50 overflow-hidden shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 cursor-pointer"
      onClick={() => router.push(`/products/${productId}`)}
    >
      {/* Wishlist Button */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlistMutation.mutate();
        }}
        className="absolute top-5 right-5 z-20 p-3 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-2xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
      >
        <Heart className="w-5 h-5 text-slate-600 hover:text-red-500 transition-colors" />
      </motion.button>

      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        
        {/* Overlay with Actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
          <div className="flex gap-3 mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                addToCartMutation.mutate();
              }}
              disabled={addToCartMutation.isPending}
              className="flex-1 rounded-2xl bg-white text-black hover:bg-slate-200 h-12"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
            </Button>
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/products/${productId}`);
              }}
              size="icon" 
              variant="secondary" 
              className="rounded-2xl h-12 w-12 bg-white/20 backdrop-blur-md border-white/20"
            >
              <Eye className="w-5 h-5 text-white" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <span className="px-2.5 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-lg">
            {product.category}
          </span>
          <div className="flex items-center text-[10px] font-black text-amber-500">
            <Star className="w-3 h-3 fill-current mr-1" />
            {product.ratings || 4.8}
          </div>
        </div>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 transition-colors group-hover:text-blue-600 mb-1">
          {product.name}
        </h3>
        <p className="text-xl font-black text-slate-900 dark:text-white">
          <span className="text-xs font-medium text-slate-500 mr-1">{env.NEXT_PUBLIC_CURRENCY === "INR" ? "₹" : "$"}</span>
          {product.price.toLocaleString()}
        </p>
      </div>
    </motion.div>
  );
};
