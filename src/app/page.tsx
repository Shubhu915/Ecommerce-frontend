"use client";

import React, { useEffect, useRef } from "react";
import { Header } from "@/components/common/Header";
import { ProductCard } from "@/components/common/ProductCard";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import { staggerContainer, fadeIn } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Shield, Globe } from "lucide-react";
import gsap from "gsap";
import Image from "next/image";

import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/userService";

export default function Home() {
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  const router = useRouter();

  const { data: recsRes } = useQuery({
    queryKey: ["home-recommendations"],
    queryFn: () => userService.getRecommendations(),
  });

  const recommendations = recsRes?.data || [];

  useEffect(() => {
    // GSAP Parallax and Reveal
    const ctx = gsap.context(() => {
      gsap.from(".hero-title span", {
        y: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "expo.out",
      });

      gsap.from(".hero-desc", {
        opacity: 0,
        y: 20,
        duration: 1,
        delay: 0.5,
      });

      gsap.from(".hero-cta", {
        opacity: 0,
        scale: 0.8,
        duration: 0.8,
        delay: 0.8,
        ease: "back.out(1.7)",
      });

      gsap.to(".floating-card", {
        y: 30,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        stagger: 0.5
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const features = [
    { icon: Zap, title: "Lightning Fast", desc: "Next-gen delivery in 24 hours" },
    { icon: Shield, title: "Secure AI", desc: "Safe personalization algorithms" },
    { icon: Globe, title: "Global Reach", desc: "Shipping to over 150 countries" },
  ];

  const onlineProducts = [
    { id: "1", name: "Nike Air Max 270", price: 12999, category: "Footwear", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800" },
    { id: "2", name: "Apple Watch Series 9", price: 41900, category: "Electronics", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=800" },
    { id: "3", name: "Sony WH-1000XM5", price: 29990, category: "Audio", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800" },
    { id: "4", name: "Dior Sauvage Parfum", price: 14500, category: "Fragrance", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white selection:bg-blue-500 selection:text-white overflow-x-hidden">
      <Header />

      <main ref={heroRef}>
        {/* Hero Section */}
        <section className="relative min-h-[100vh] flex items-center pt-20">
          <div className="absolute inset-0 overflow-hidden -z-10">
            <motion.div style={{ y: y1 }} className="absolute -top-[10%] -right-[5%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full" />
            <motion.div style={{ y: y2 }} className="absolute -bottom-[10%] -left-[5%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full" />
          </div>

          <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 bg-blue-500/10 dark:bg-blue-500/20 backdrop-blur-xl px-4 py-1.5 rounded-xl border border-blue-500/20"
              >
                <Sparkles className="w-3 h-3 text-blue-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Discover The Future</span>
              </motion.div>
              
              <h1 className="hero-title text-6xl lg:text-[8rem] font-black leading-[0.85] tracking-tighter">
                <span className="block italic">CRAFTED</span>
                <span className="block text-gradient bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">BEYOND</span>
                <span className="block">REALITY.</span>
              </h1>

              <p className="hero-desc text-base lg:text-lg text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
                Elevate your lifestyle with our AI-curated selection of premium goods. Precision engineered, beautifully designed.
              </p>

              <div className="hero-cta flex flex-wrap gap-4">
                <Button 
                  onClick={() => router.push('/products')}
                  size="lg" className="h-14 px-8 rounded-2xl text-base font-black tracking-widest shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:shadow-blue-600/40 transition-all duration-300"
                >
                  Explore Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  onClick={() => router.push('/products?collection=true')}
                  variant="outline" size="lg" className="h-14 px-8 rounded-2xl text-base font-black tracking-widest border-2 border-slate-200 dark:border-slate-800 backdrop-blur-md"
                >
                  Collections
                </Button>
              </div>

              <div className="flex items-center gap-10 pt-10">
                {features.map((f, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <f.icon className="w-6 h-6 text-blue-500" />
                    <div>
                      <p className="font-bold text-sm leading-none">{f.title}</p>
                      <p className="text-[10px] text-slate-500">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative group perspective-1000 lg:scale-90 xl:scale-100">
              <div className="relative z-10 w-full max-w-[500px] mx-auto aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl transition-transform duration-700 hover:rotate-2">
                 <Image 
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200"
                  alt="Premium Hero"
                  fill
                  className="object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
                  priority
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                 <div className="absolute bottom-10 left-10 text-white">
                    <p className="text-3xl font-black mb-2 tracking-tighter uppercase leading-none">LIMITED EDITION</p>
                    <p className="text-xs opacity-80 uppercase tracking-widest font-bold">Summer Drop 2024</p>
                 </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500 rounded-full blur-[80px] -z-10 opacity-30" />
              <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-purple-500 rounded-full blur-[100px] -z-10 opacity-30" />
              
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: -1 }}
                className="absolute top-20 -right-12 z-20 bg-white/10 backdrop-blur-2xl border border-white/20 p-6 rounded-3xl shadow-2xl floating-card hidden xl:block"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white font-bold">AI</div>
                  <div>
                    <p className="text-[10px] font-bold text-blue-500">SMART PICK</p>
                    <p className="font-bold text-sm">Ultra Boost XL</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Categories / Ticker Section could go here */}

        {/* Featured Products */}
        <section className="py-32 bg-white dark:bg-[#080808]">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
              <div className="space-y-4">
                <h2 className="text-5xl lg:text-7xl font-black tracking-tighter leading-none">
                  CURATED FOR <br /> <span className="text-blue-600 italic">EXCELLENCE.</span>
                </h2>
                <p className="text-slate-500 text-lg max-w-md italic">A selection of products that define modern sophistication and AI intelligence.</p>
              </div>
              <Button 
                onClick={() => router.push('/products')}
                variant="link" className="text-xl font-black group p-0 h-auto"
              >
                VIEW ALL DROP
                <ArrowRight className="ml-4 w-8 h-8 group-hover:translate-x-3 transition-transform duration-500" />
              </Button>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-10"
            >
              {(recommendations.length > 0 ? recommendations : onlineProducts).map((p: any) => (
                <motion.div key={p._id || p.id} variants={fadeIn}>
                  <ProductCard
                    product={{
                      _id: p._id || p.id,
                      name: p.name,
                      price: p.price,
                      category: p.category,
                      images: p.images || [p.image],
                      stock: p.stock || 10,
                      description: p.description || "High-end product.",
                      numReviews: p.numReviews || 0,
                      ratings: p.ratings || 4.5,
                      slug: p.slug || "",
                      aiMetadata: p.aiMetadata || {}
                    } as any}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Marquee or Newsletter or AI Section */}
        <section className="py-20 relative overflow-hidden bg-blue-600 text-white">
           <div className="absolute inset-0 opacity-10">
              <div className="flex rotate-12 -translate-y-20 scale-150">
                 {[1,2,3,4,5].map(i => (
                    <span key={i} className="text-[15rem] font-black mr-20">AI•STORE•AI•STORE•</span>
                 ))}
              </div>
           </div>
           
           <div className="container mx-auto px-6 relative z-10 text-center space-y-8">
              <h2 className="text-4xl lg:text-7xl font-black leading-none tracking-tighter">
                READY TO JOIN THE <br /> FUTURE OF COMMERCE?
              </h2>
              <p className="text-blue-100 text-xl max-w-2xl mx-auto font-medium">
                Experience the most advanced shopping engine ever built.
              </p>
              <Button 
                onClick={() => router.push('/register')}
                size="lg" className="h-16 px-12 rounded-2xl bg-white text-blue-600 hover:bg-slate-100 text-xl font-black"
              >
                GET STARTED
              </Button>
           </div>
        </section>
      </main>
      
      {/* Custom Cursor or other premium traits could go here */}
    </div>
  );
}
