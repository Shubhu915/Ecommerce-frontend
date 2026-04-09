"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/common/Header";
import { orderService } from "@/services/orderService";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, Truck, Calendar, MapPin, CreditCard, ArrowLeft } from "lucide-react";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: orderRes, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => orderService.getOrderDetails(id as string),
  });

  const order = orderRes?.data || orderRes;

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!order) return <div className="min-h-screen flex items-center justify-center">Order not found.</div>;

  const steps = [
    { label: "Pending", icon: Calendar, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Processing", icon: Package, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Shipped", icon: Truck, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Delivered", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" }
  ];

  const currentStep = steps.findIndex(s => s.label === order.status);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-slate-900 dark:text-white">
      <Header />
      
      <main className="container mx-auto px-6 pt-32 pb-24">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="space-y-4">
              <Button variant="ghost" onClick={() => router.push("/profile")} className="p-0 h-auto hover:bg-transparent text-slate-400 gap-2 font-black uppercase text-[10px] tracking-widest">
                <ArrowLeft className="w-4 h-4" /> Back to History
              </Button>
              <h1 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase leading-[0.85]">
                ORDER <br /> <span className="text-blue-600">CONFIRMED</span>
              </h1>
              <p className="text-slate-500 font-medium">ID: #{order._id?.slice(-8).toUpperCase()}</p>
            </div>
            
            <div className="flex items-center gap-4 bg-green-500/10 text-green-500 px-6 py-4 rounded-[2rem] border border-green-500/20">
               <CheckCircle2 className="w-8 h-8" />
               <div className="leading-tight">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Status</p>
                  <p className="text-xl font-black uppercase">{order.status}</p>
               </div>
            </div>
          </div>

          {/* Stepper */}
          <div className="relative pt-10 pb-20 px-8">
             <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 dark:bg-white/5 -translate-y-1/2 rounded-full" />
             <div 
               className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 rounded-full transition-all duration-1000" 
               style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
             />
             
             <div className="relative z-10 flex justify-between">
                {steps.map((step, idx) => {
                  const isActive = idx <= currentStep;
                  return (
                    <div key={idx} className="flex flex-col items-center">
                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-4 transition-all duration-500 ${
                         isActive ? "bg-white dark:bg-slate-900 border-blue-600 text-blue-600 shadow-xl shadow-blue-500/20 scale-110" : "bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-300"
                       }`}>
                          <step.icon className="w-6 h-6" />
                       </div>
                       <p className={`mt-4 text-[9px] font-black uppercase tracking-widest ${isActive ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>
                         {step.label}
                       </p>
                    </div>
                  );
                })}
             </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
             <div className="lg:col-span-2 space-y-8">
                {/* Items */}
                <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200/50 dark:border-white/5 shadow-2xl shadow-slate-200/40 dark:shadow-none space-y-8">
                   <h3 className="text-2xl font-black uppercase tracking-tighter">PACKAGE CONTENTS</h3>
                   <div className="space-y-6">
                      {order.orderItems.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-8 group">
                           <div className="w-24 h-24 rounded-3xl overflow-hidden bg-slate-50 dark:bg-white/5">
                              <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                           </div>
                           <div className="flex-1 space-y-1">
                              <h4 className="text-xl font-black tracking-tight uppercase">{item.name}</h4>
                              <p className="text-slate-500 font-bold text-sm">Qty: {item.qty} • Price: ₹{item.price.toLocaleString()}</p>
                           </div>
                           <p className="text-xl font-black">₹{(item.price * item.qty).toLocaleString()}</p>
                        </div>
                      ))}
                   </div>
                   <div className="pt-8 border-t border-slate-100 dark:border-white/5 flex justify-between items-center">
                      <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Final Amount Paid</p>
                      <p className="text-4xl font-black text-blue-600">₹{order.totalPrice.toLocaleString()}</p>
                   </div>
                </div>
             </div>

             <div className="space-y-8">
                {/* Shipping Info */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200/50 dark:border-white/5 shadow-xl shadow-slate-200/20 dark:shadow-none space-y-6">
                   <h3 className="text-sm font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> SHIP TO
                   </h3>
                   <div className="space-y-2">
                      <p className="text-lg font-black tracking-tight">{order.shippingAddress.street}</p>
                      <p className="text-slate-500 font-bold text-sm uppercase">
                        {order.shippingAddress.city}, {order.shippingAddress.zipCode}<br />
                        {order.shippingAddress.country}
                      </p>
                   </div>
                </div>

                {/* Payment Info */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200/50 dark:border-white/5 shadow-xl shadow-slate-200/20 dark:shadow-none space-y-6">
                   <h3 className="text-sm font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" /> PAYMENT
                   </h3>
                   <div className="space-y-2">
                      <p className="text-lg font-black tracking-tight">{order.paymentMethod || "Credit Card"}</p>
                      <p className="text-slate-500 font-bold text-sm uppercase italic opacity-60">Verified via AI Transaction Flow</p>
                   </div>
                </div>

                <Button className="w-full h-16 rounded-[2rem] bg-blue-600 font-black tracking-widest group" onClick={() => router.push("/products")}>
                   CONTINUE SHOPPING <ArrowLeft className="w-5 h-5 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
                </Button>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
