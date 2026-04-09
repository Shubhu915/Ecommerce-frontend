"use client";

import React, { useState } from "react";
import { Header } from "@/components/common/Header";
import { useAuthStore } from "@/store/useAuthStore";
import { userService } from "@/services/userService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { User as UserIcon, Mail, Phone, MapPin, Camera, Save, Settings, Package, Heart, LogOut } from "lucide-react";
import { toast } from "sonner";
import { fadeIn } from "@/lib/animations";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, clearAuth } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const { data: profileRes, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => userService.getProfile(),
    enabled: !!user,
  });

  const profile = profileRes?.data || user;

  const [formData, setFormData] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => userService.updateProfile(data),
    onSuccess: () => {
      toast.success("Profile updated!");
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Update failed");
    }
  });

  if (!user) return <div className="min-h-screen flex items-center justify-center">Please log in.</div>;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-slate-900 dark:text-white">
      <Header />
      
      <main className="container mx-auto px-6 pt-32 pb-24">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase">Your <span className="text-blue-600">Profile</span></h1>
              <p className="text-slate-500 font-medium">Manage your AI-powered shopping account.</p>
            </motion.div>
            
            <div className="flex gap-4">
               <Button 
                onClick={() => toast.info("Advanced settings coming soon!")}
                variant="outline" className="h-14 px-6 rounded-2xl border-2 font-black tracking-widest gap-2"
               >
                 <Settings className="w-5 h-5" /> ACCOUNT SETTINGS
               </Button>
               <Button onClick={() => clearAuth()} variant="destructive" className="h-14 px-6 rounded-2xl font-black tracking-widest gap-2">
                 <LogOut className="w-5 h-5" /> SIGN OUT
               </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Sidebar info */}
            <div className="space-y-8">
              <motion.div 
                variants={fadeIn}
                initial="initial"
                animate="animate"
                className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200/50 dark:border-white/5 shadow-2xl shadow-slate-200/40 dark:shadow-none text-center relative overflow-hidden"
              >
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="w-full h-full bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-white text-5xl font-black">
                    {profile?.name?.[0]?.toUpperCase()}
                  </div>
                  <button className="absolute bottom-0 right-0 p-3 bg-white dark:bg-black rounded-2xl shadow-xl border border-slate-100 dark:border-white/10 hover:text-blue-600 transition-colors">
                    <Camera className="w-5 h-5" />
                  </button>
                </div>
                
                <h2 className="text-3xl font-black tracking-tight">{profile?.name}</h2>
                <p className="text-slate-500 font-medium lowercase italic">@{profile?.role}</p>
                
                <div className="mt-10 space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-transparent hover:border-blue-500/20 transition-all">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-bold truncate">{profile?.email}</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-transparent hover:border-blue-500/20 transition-all">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-bold">+91 ••••• •••••</span>
                  </div>
                </div>
              </motion.div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-24 rounded-[2rem] border-2 flex-col gap-2 relative group overflow-hidden" onClick={() => router.push('/cart')}>
                   <Package className="w-6 h-6 text-blue-600" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Orders / Cart</span>
                   <div className="absolute inset-0 bg-blue-600/5 translate-y-full group-hover:translate-y-0 transition-transform" />
                </Button>
                <Button variant="outline" className="h-24 rounded-[2rem] border-2 flex-col gap-2 relative group overflow-hidden" onClick={() => router.push('/wishlist')}>
                   <Heart className="w-6 h-6 text-red-500" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Wishlist</span>
                   <div className="absolute inset-0 bg-red-600/5 translate-y-full group-hover:translate-y-0 transition-transform" />
                </Button>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
               <motion.div 
                variants={fadeIn}
                initial="initial"
                animate="animate"
                className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 lg:p-14 border border-slate-200/50 dark:border-white/5 shadow-2xl shadow-slate-200/40 dark:shadow-none space-y-10"
               >
                 <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-black tracking-tighter">PERSONAL INFORMATION</h2>
                    {isEditing ? (
                      <div className="flex gap-2">
                        <Button variant="ghost" className="rounded-xl font-bold font-black uppercase text-[10px] tracking-widest" onClick={() => setIsEditing(false)}>Cancel</Button>
                        <Button className="rounded-xl font-black uppercase text-[10px] tracking-widest bg-blue-600 gap-2" onClick={() => updateProfileMutation.mutate(formData)}>
                          <Save className="w-3 h-3" /> Save Changes
                        </Button>
                      </div>
                    ) : (
                      <Button variant="outline" className="rounded-xl font-black uppercase text-[10px] tracking-widest border-2" onClick={() => setIsEditing(true)}>
                        Edit Profile
                      </Button>
                    )}
                 </div>

                 <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2 group">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-blue-600 transition-colors">Full Name</label>
                      <input 
                        defaultValue={profile.name}
                        readOnly={!isEditing}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className={`w-full px-6 py-4 rounded-2xl border text-sm font-bold outline-none transition-all ${
                          isEditing ? "bg-slate-50 dark:bg-white/5 border-blue-500/30 focus:ring-4 ring-blue-500/10" : "bg-transparent border-transparent"
                        }`}
                      />
                    </div>
                    <div className="space-y-2 group">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                      <input 
                        defaultValue={profile.email}
                        readOnly
                        className="w-full px-6 py-4 rounded-2xl border border-transparent bg-transparent text-sm font-bold opacity-60"
                      />
                    </div>
                 </div>

                 <div className="space-y-8 pt-6">
                    <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-4">
                      <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
                        <MapPin className="w-6 h-6 text-blue-600" /> SHIPPING ADDRESSES
                      </h3>
                      <Button 
                        onClick={() => toast.info("Address management coming soon!")}
                        variant="link" className="text-blue-600 font-black uppercase text-[10px] tracking-widest">+ Add New</Button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                       <div className="p-8 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center group hover:border-blue-600/30 transition-all cursor-pointer">
                          <p className="text-xs font-bold text-slate-400 group-hover:text-blue-600">No addresses saved yet.</p>
                       </div>
                    </div>
                 </div>
               </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
