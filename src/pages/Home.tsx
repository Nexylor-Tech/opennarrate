import { useState, useEffect } from "react";
import { BlogCard } from "../components/BlogCard";
import { api } from "../api";
import type { Blog } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, Filter } from "lucide-react";

export function Home() {
  const [featuredBlogs, setFeaturedBlogs] = useState<Blog[]>([]);
  const [recentBlogs, setRecentBlogs] = useState<Blog[]>([]);
  const [bestBlogs, setBestBlogs] = useState<Blog[]>([]);
  const [bestTimeframe, setBestTimeframe] = useState<'month' | 'year'>('month');
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      const [featured, recent, best] = await Promise.all([
        api.getFeaturedBlogs(),
        api.getRecentBlogs(),
        api.getBestBlogs(bestTimeframe)
      ]);
      setFeaturedBlogs(featured);
      setRecentBlogs(recent);
      setBestBlogs(best);
    };
    loadData();
  }, [bestTimeframe]);

  // Auto-sliding for featured blogs
  useEffect(() => {
    if (featuredBlogs.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentFeaturedIndex((prev) => (prev + 1) % featuredBlogs.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredBlogs.length]);

  return (
    <div className="space-y-20 pb-10">
      {/* Hero Section / Featured Blogs */}
      <section className="pt-8">
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            {featuredBlogs.length > 0 && (
              <motion.div
                key={currentFeaturedIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                <BlogCard blog={featuredBlogs[currentFeaturedIndex]} featured />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Slider Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {featuredBlogs.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentFeaturedIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${idx === currentFeaturedIndex ? 'w-6 bg-[var(--primary)]' : 'bg-[var(--border)] hover:bg-[var(--muted-foreground)]'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Blogs */}
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h2 className="text-3xl font-bold tracking-tight  ">Recent Blogs</h2>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-5 py-3 rounded-sm border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] transition-colors text-base font-medium  ">
              <Filter size={16} className="" /> Categories
            </button>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -/2 text-[var(--muted-foreground)]" />
              <input 
                type="text" 
                placeholder="Search blogs..." 
                className="pl-10 pr-4 py-3 rounded-sm border border-[var(--border)] bg-[var(--card)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-base w-full md:w-64 "
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {recentBlogs.map(blog => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </section>

      {/* All Blogs / Best Of */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-3xl font-bold tracking-tight  ">All Blogs</h2>
          <div className="relative group">
            <button className="flex items-center gap-1 text-base font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors  ">
              Best of the {bestTimeframe} <ChevronDown size={16} className="" />
            </button>
            <div className="absolute top-full left-0 mt-2 w-48 bg-[var(--card)] border border-[var(--border)] rounded-sm shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 overflow-hidden">
              <button 
                className="w-full text-left px-5 py-3 text-base hover:bg-[var(--muted)] transition-colors  "
                onClick={() => setBestTimeframe('month')}
              >
                Best of the month
              </button>
              <button 
                className="w-full text-left px-5 py-3 text-base hover:bg-[var(--muted)] transition-colors   border-t border-[var(--border)]"
                onClick={() => setBestTimeframe('year')}
              >
                Best of the year
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {bestBlogs.map(blog => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </section>
    </div>
  );
}
