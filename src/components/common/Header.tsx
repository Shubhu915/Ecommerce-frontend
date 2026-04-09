"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, User, Heart, Mic, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { cartService } from "@/services/cartService";
import { toast } from "sonner";

export const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  const { data: cartRes } = useQuery({
    queryKey: ["cart"],
    queryFn: () => cartService.getCart(),
    enabled: isAuthenticated,
  });

  const cartCount = cartRes?.data?.items?.length || cartRes?.items?.length || 0;

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 z-[100] w-full transition-all duration-500 px-6 py-4",
        isScrolled ? "pt-2" : "pt-6"
      )}
    >
      <div 
        className={cn(
          "container mx-auto px-6 h-20 flex items-center justify-between rounded-[2rem] border transition-all duration-500",
          isScrolled 
            ? "bg-white/70 dark:bg-black/70 backdrop-blur-2xl border-white/20 dark:border-slate-800/50 shadow-2xl" 
            : "bg-transparent border-transparent"
        )}
      >
        {/* Left: Mobile Menu & Logo */}
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => toast.info("Mobile menu coming soon!")}
            variant="ghost" size="icon" className="md:hidden rounded-2xl"
          >
            <Menu className="w-6 h-6" />
          </Button>
          <Link href="/" className="text-2xl font-black tracking-tighter">
            AI<span className="text-blue-600 italic">.</span>STORE
          </Link>
        </div>

        {/* Center: Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {["Products", "Collections", "About", "New Drops"].map((item) => (
            <Link 
              key={item} 
              href={`/${item.toLowerCase().replace(" ", "-") === "products" ? "products" : item.toLowerCase().replace(" ", "-")}`} 
              className="text-[10px] font-black uppercase tracking-[0.2em] hover:text-blue-600 transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 350, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="relative"
                >
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearch}
                    className="w-full bg-slate-100 dark:bg-white/10 rounded-2xl py-3 px-5 pr-12 outline-none text-sm font-medium border border-transparent focus:border-blue-500/50 transition-all backdrop-blur-md"
                    placeholder="Search with AI Intelligence..."
                  />
                  <Mic className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </motion.div>
              )}
            </AnimatePresence>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={cn("rounded-2xl h-12 w-12", isSearchOpen && "absolute right-0")}
            >
              {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </Button>
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-white/10 rounded-2xl p-1 border border-transparent hover:border-white/10 transition-all">
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10">
                <Heart className="w-5 h-5" />
              </Button>
            </Link>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 relative">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-blue-600 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>

          <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2 hidden sm:block" />

          {isAuthenticated ? (
            <Link href={user?.role === "admin" ? "/admin" : "/profile"}>
              <Button className="rounded-2xl h-11 px-5 font-bold flex items-center gap-2">
                <div className="w-5 h-5 rounded-lg bg-white/20 flex items-center justify-center text-[8px]">
                  {user?.name.charAt(0)}
                </div>
                <span className="text-xs">{user?.name.split(" ")[0]}</span>
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button className="rounded-2xl h-11 px-6 text-[10px] font-black tracking-[0.2em] bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20">
                JOIN NOW
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
