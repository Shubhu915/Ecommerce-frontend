"use client";

import React from "react";
import { Header } from "@/components/common/Header";
import { cartService } from "@/services/cartService";
import { orderService } from "@/services/orderService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: cartRes, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: () => cartService.getCart(),
  });

  const cartItems = cartRes?.data?.items || cartRes?.items || [];
  const subtotal = cartRes?.data?.subtotal || cartRes?.subtotal || 0;

  const updateQtyMutation = useMutation({
    mutationFn: ({ id, qty }: { id: string; qty: number }) => cartService.updateCartItem(id, qty),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const removeItemMutation = useMutation({
    mutationFn: (id: string) => cartService.removeFromCart(id),
    onSuccess: () => {
      toast.success("Item removed");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-slate-900 dark:text-white">
      <Header />
      
      <main className="container mx-auto px-6 pt-32 pb-24">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Cart Items */}
          <div className="flex-1 space-y-10 w-full">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-[7rem] font-black tracking-tighter leading-none mb-4">
                SHOPPING <span className="text-blue-600">BAG</span>
              </h1>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
                {cartItems.length} items ready for delivery
              </p>
            </div>

            <AnimatePresence mode="popLayout">
              {cartItems.length > 0 ? (
                <div className="space-y-6">
                  {cartItems.map((item: any) => (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="group bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200/50 dark:border-white/5 flex flex-col md:flex-row items-center gap-8 shadow-2xl shadow-slate-200/40 dark:shadow-none hover:shadow-blue-500/10 transition-all duration-500"
                    >
                      <div className="relative w-40 h-40 rounded-[2rem] overflow-hidden bg-slate-50 dark:bg-white/5">
                        <Image 
                          src={item.product.images?.[0]?.url || item.product.images?.[0] || "/placeholder.jpg"} 
                          alt={item.product.name} 
                          fill 
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                      
                      <div className="flex-1 space-y-2 text-center md:text-left">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{item.product.category}</span>
                        <h3 className="text-2xl font-black tracking-tight group-hover:text-blue-600 transition-colors uppercase">{item.product.name}</h3>
                        <p className="text-2xl font-black">₹{item.product.price.toLocaleString()}</p>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="flex items-center bg-slate-50 dark:bg-white/5 p-1 rounded-2xl border border-slate-100 dark:border-white/5">
                          <button 
                            onClick={() => updateQtyMutation.mutate({ id: item._id, qty: Math.max(1, item.qty - 1) })}
                            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white dark:hover:bg-white/10 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center font-black">{item.qty}</span>
                          <button 
                            onClick={() => updateQtyMutation.mutate({ id: item._id, qty: item.qty + 1 })}
                            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white dark:hover:bg-white/10 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => removeItemMutation.mutate(item._id)}
                          className="w-14 h-14 flex items-center justify-center rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
                        >
                          <Trash2 className="w-6 h-6" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-40 bg-white dark:bg-slate-900 rounded-[4rem] border border-dashed border-slate-200 dark:border-slate-800">
                   <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ShoppingBag className="w-10 h-10 text-blue-600" />
                   </div>
                   <h2 className="text-3xl font-black mb-4">YOUR BAG IS EMPTY</h2>
                   <Button onClick={() => router.push("/products")} className="rounded-2xl h-14 px-8 bg-blue-600 font-black tracking-widest uppercase">Start Shopping</Button>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Summary Sidebar */}
          {cartItems.length > 0 && (
            <div className="w-full lg:w-[450px] space-y-10 sticky top-32">
              <div className="bg-white dark:bg-slate-900 p-10 lg:p-14 rounded-[4rem] border border-slate-200/50 dark:border-white/5 shadow-2xl shadow-slate-200/40 dark:shadow-none space-y-10">
                <h2 className="text-3xl font-black tracking-tighter uppercase leading-none">Order <span className="text-blue-600">Summary</span></h2>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-center text-slate-500 font-bold uppercase tracking-widest text-xs">
                    <span>Subtotal</span>
                    <span className="text-slate-900 dark:text-white">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500 font-bold uppercase tracking-widest text-xs">
                    <span>Shipping</span>
                    <span className="text-green-500">FREE</span>
                  </div>
                  <div className="h-[1px] bg-slate-100 dark:bg-white/5" />
                  <div className="flex justify-between items-center py-4">
                    <span className="text-xl font-black uppercase tracking-tighter">Total</span>
                    <span className="text-4xl font-black text-blue-600">₹{subtotal.toLocaleString()}</span>
                  </div>
                </div>

                <Button 
                  onClick={() => router.push("/checkout")}
                  className="w-full h-20 rounded-[2.5rem] text-[14px] font-black tracking-[0.2em] shadow-2xl shadow-blue-500/30 gap-4"
                >
                  PROCEED TO CHECKOUT <ArrowRight className="w-6 h-6" />
                </Button>

                <div className="space-y-4 pt-10 border-t border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-4">
                    <ShieldCheck className="w-6 h-6 text-blue-600" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Secure AI-encrypted Payment</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Truck className="w-6 h-6 text-blue-600" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Global Express Delivery</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
