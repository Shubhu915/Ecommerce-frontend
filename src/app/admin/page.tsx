"use client";

import React, { useEffect } from "react";
import { Header } from "@/components/common/Header";
import { useAuthStore } from "@/store/useAuthStore";
import { adminService } from "@/services/adminService";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Plus
} from "lucide-react";
import { useRouter } from "next/navigation";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { toast } from "sonner";

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/");
    }
  }, [user, router]);

  const { data: statsRes, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => adminService.getStats(),
    enabled: user?.role === "admin",
  });

  const stats = statsRes?.data || {
    totalRevenue: 1250000,
    activeOrders: 42,
    lowStockAlerts: 5,
  };

  if (user?.role !== "admin") return null;

  const statCards = [
    { label: "Total Revenue", value: `₹${stats.totalRevenue?.toLocaleString()}`, icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10", trend: "+12.5%", isUp: true },
    { label: "Active Orders", value: stats.activeOrders, icon: ShoppingCart, color: "text-blue-500", bg: "bg-blue-500/10", trend: "+4", isUp: true },
    { label: "Inventory Items", value: 148, icon: Package, color: "text-purple-500", bg: "bg-purple-500/10", trend: "-2", isUp: false },
    { label: "Low Stock", value: stats.lowStockAlerts, icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10", trend: "Critical", isUp: false },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-slate-900 dark:text-white">
      <Header />
      
      <main className="container mx-auto px-6 pt-32 pb-24">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8">
           <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase leading-[0.85]">
                ADMIN <br /> <span className="text-blue-600">MISSION CONTROL</span>
              </h1>
              <p className="text-slate-500 font-medium uppercase tracking-[0.3em] text-[10px]">Real-time e-commerce intelligence platform</p>
           </div>
           
           <div className="flex gap-4">
              <Button onClick={() => router.push('/admin/products/new')} className="h-16 px-8 rounded-2xl bg-blue-600 font-black tracking-widest gap-3 shadow-2xl shadow-blue-500/30">
                 <Plus className="w-5 h-5" /> NEW PRODUCT
              </Button>
              <Button 
                onClick={() => toast.info("Reports and analytics coming soon!")}
                variant="outline" className="h-16 px-8 rounded-2xl border-2 font-black tracking-widest uppercase"
              >
                 <BarChart3 className="w-5 h-5 mr-3" /> Reports
              </Button>
           </div>
        </div>

        {/* Stats Grid */}
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          {statCards.map((stat, idx) => (
            <motion.div 
              key={idx}
              variants={fadeIn}
              className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200/50 dark:border-white/5 shadow-2xl shadow-slate-200/40 dark:shadow-none space-y-6 group hover:border-blue-500/20 transition-all cursor-pointer"
            >
               <div className="flex justify-between items-center">
                  <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                     <stat.icon className="w-7 h-7" />
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${stat.isUp ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.trend} {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  </div>
               </div>
               
               <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
                  <p className="text-4xl font-black mt-1">{stat.value}</p>
               </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts and Tables placeholder */}
        <div className="grid lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200/50 dark:border-white/5 shadow-2xl shadow-slate-200/40 dark:shadow-none min-h-[500px] flex flex-col items-center justify-center text-center">
              <BarChart3 className="w-16 h-16 text-slate-200 dark:text-slate-800 mb-6" />
              <h2 className="text-2xl font-black opacity-20 uppercase tracking-widest">Revenue Analytics Visualization</h2>
              <p className="text-slate-400 font-medium">Coming soon in v1.1</p>
           </div>

           <div className="bg-white dark:bg-slate-900 rounded-[4rem] p-10 border border-slate-200/50 dark:border-white/5 shadow-2xl shadow-slate-200/40 dark:shadow-none space-y-8">
              <h3 className="text-2xl font-black uppercase tracking-tighter">RECENT SALES</h3>
              <div className="space-y-6">
                 {[1,2,3,4,5].map(i => (
                   <div key={i} className="flex items-center gap-4 group">
                      <div className="w-12 h-12 bg-slate-50 dark:bg-white/5 rounded-xl border border-transparent group-hover:border-blue-500/20 transition-all flex items-center justify-center font-black">
                         #{100 + i}
                      </div>
                      <div className="flex-1">
                         <p className="text-sm font-black uppercase">Standard User</p>
                         <p className="text-[10px] font-bold text-slate-400 tracking-widest">₹14,299 • 2h ago</p>
                      </div>
                      <div className="text-[9px] font-black uppercase tracking-widest text-green-500 bg-green-500/10 px-2 py-1 rounded-md">Paid</div>
                   </div>
                 ))}
              </div>
              <Button 
                onClick={() => toast.info("Full transaction history coming soon!")}
                variant="link" className="w-full text-blue-600 font-black uppercase text-xs tracking-[0.2em]"
              >
                View All Transactions
              </Button>
           </div>
        </div>
      </main>
    </div>
  );
}
