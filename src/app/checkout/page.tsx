"use client";

import React, { useState } from "react";
import { Header } from "@/components/common/Header";
import { cartService } from "@/services/cartService";
import { orderService } from "@/services/orderService";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CreditCard, MapPin, Truck, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const [address, setAddress] = useState({
    street: "",
    city: "",
    zipCode: "",
    country: "India"
  });

  const { data: cartRes, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: () => cartService.getCart(),
  });

  const cartItems = cartRes?.data?.items || [];
  const subtotal = cartRes?.data?.subtotal || 0;

  const createOrderMutation = useMutation({
    mutationFn: () => orderService.createOrder({
      shippingAddress: address,
      orderItems: cartItems.map((i: any) => ({
        product: i.product._id,
        qty: i.qty,
        name: i.product.name,
        price: i.product.price,
        image: i.product.images[0]?.url || i.product.images[0]
      })),
      totalPrice: subtotal,
      paymentMethod: "Credit Card" // Prototype
    }),
    onSuccess: (res) => {
      toast.success("Order placed successfully!");
      router.push(`/orders/${res.data?._id || res._id}`);
    },
    onError: (err: any) => {
      toast.error(err.message || "Checkout failed");
    }
  });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-slate-900 dark:text-white">
      <Header />
      
      <main className="container mx-auto px-6 pt-32 pb-24">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-none">SECURE <span className="text-blue-600">CHECKOUT</span></h1>
            <p className="text-slate-500 font-medium uppercase tracking-widest text-[10px]">Step into the future of automated fulfillment</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
             {/* Shipping Info */}
             <div className="space-y-10">
                <div className="space-y-6">
                  <h3 className="text-2xl font-black flex items-center gap-4">
                     <MapPin className="w-6 h-6 text-blue-600" /> SHIPPING DESTINATION
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Street Address</label>
                      <input 
                        value={address.street}
                        onChange={(e) => setAddress({...address, street: e.target.value})}
                        className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:ring-4 ring-blue-500/10 focus:border-blue-500/50 transition-all font-bold text-sm"
                        placeholder="123 AI Lane, Cyber City"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">City</label>
                        <input 
                          value={address.city}
                          onChange={(e) => setAddress({...address, city: e.target.value})}
                          className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:ring-4 ring-blue-500/10 focus:border-blue-500/50 transition-all font-bold text-sm"
                          placeholder="Mumbai"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Zip Code</label>
                        <input 
                          value={address.zipCode}
                          onChange={(e) => setAddress({...address, zipCode: e.target.value})}
                          className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl px-6 py-4 outline-none focus:ring-4 ring-blue-500/10 focus:border-blue-500/50 transition-all font-bold text-sm"
                          placeholder="400001"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-2xl font-black flex items-center gap-4 uppercase">
                     <CreditCard className="w-6 h-6 text-blue-600" /> Payment Information
                  </h3>
                  <div className="p-8 rounded-[2rem] bg-blue-600 text-white space-y-8 shadow-2xl shadow-blue-500/40 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
                     <div className="flex justify-between items-start relative z-10">
                        <div className="w-12 h-8 bg-amber-400/80 rounded-md" /> { /* Chip */}
                        <p className="text-xl font-black italic">AI.CARD</p>
                     </div>
                     <div className="space-y-1 relative z-10">
                        <p className="text-xs font-bold opacity-60 tracking-[0.3em]">SECURE IDENTITY</p>
                        <p className="text-xl font-black tracking-[0.2em]">**** **** **** 1010</p>
                     </div>
                  </div>
                  <p className="text-[10px] font-black text-slate-400 text-center uppercase tracking-widest">Prototype Payment Mode: AI Card Auto-detected</p>
                </div>
             </div>

             {/* Review */}
             <div className="bg-white dark:bg-slate-900 p-10 lg:p-14 rounded-[4rem] border border-slate-200/50 dark:border-white/5 shadow-2xl shadow-slate-200/40 dark:shadow-none space-y-10">
                <h3 className="text-2xl font-black uppercase tracking-tighter">ORDER <span className="text-blue-600">REVIEW</span></h3>
                
                <div className="max-h-[300px] overflow-y-auto pr-4 space-y-4">
                   {cartItems.map((item: any) => (
                     <div key={item._id} className="flex gap-4 items-center">
                        <img src={item.product.images[0]?.url || item.product.images[0]} className="w-16 h-16 rounded-2xl object-cover" />
                        <div className="flex-1">
                          <p className="text-sm font-black uppercase truncate">{item.product.name}</p>
                          <p className="text-xs text-blue-600 font-black">₹{item.product.price.toLocaleString()} x {item.qty}</p>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-white/5">
                   <div className="flex justify-between font-bold text-xs text-slate-400 uppercase tracking-widest">
                      <span>Subtotal</span>
                      <span className="text-slate-900 dark:text-white">₹{subtotal.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between font-bold text-xs text-slate-400 uppercase tracking-widest">
                      <span>Shipping</span>
                      <span className="text-green-500">FREE</span>
                   </div>
                   <div className="flex justify-between py-4">
                      <span className="text-2xl font-black uppercase tracking-tighter">Total Due</span>
                      <span className="text-3xl font-black text-blue-600">₹{subtotal.toLocaleString()}</span>
                   </div>
                </div>

                <Button 
                  onClick={() => createOrderMutation.mutate()}
                  className="w-full h-20 rounded-[2.5rem] text-[14px] font-black tracking-[0.2em] shadow-2xl shadow-blue-500/30 gap-4"
                  disabled={createOrderMutation.isPending || !address.street}
                >
                  {createOrderMutation.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : "COMPLETE PURCHASE"}
                  {!createOrderMutation.isPending && <ArrowRight className="w-6 h-6" />}
                </Button>

                <div className="flex items-center gap-3 justify-center opacity-40">
                   <ShieldCheck className="w-4 h-4" />
                   <p className="text-[9px] font-black uppercase tracking-widest">END-TO-END ENCRYPTED</p>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
