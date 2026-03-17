import { Link } from "react-router-dom";
import type { Blog } from "../types";

interface FeaturedCardProps {
  blog: Blog;
}

export function FeaturedCard({ blog }: FeaturedCardProps) {
  const excerptWords = blog.excerpt ? blog.excerpt.trim().split(/\s+/) : [];
  const truncatedExcerpt = excerptWords.length > 20 
    ? excerptWords.slice(0, 20).join(" ") + "..." 
    : blog.excerpt;

  return (
    <div className="relative w-full max-w-5xl mx-auto aspect-video rounded-sm overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10" />
      <img
        src={blog.coverImage}
        alt={blog.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        referrerPolicy="no-referrer"
      />
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20 text-white">
        <div className="flex items-center gap-2 text-white/80 font-medium text-xs tracking-wider uppercase mb-3">
          <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />
          {blog.category}
        </div>
        
        <h3 className="text-2xl md:text-4xl font-bold leading-tight mb-3 group-hover:text-[var(--primary)] transition-colors line-clamp-2">
          {blog.title}
        </h3>
        
        {truncatedExcerpt && (
          <p className="text-white/80 text-sm md:text-base mb-6 max-w-3xl">
            {truncatedExcerpt}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
          <div className="flex items-center gap-3">
            <img 
              src={blog.author.avatar} 
              alt={blog.author.name} 
              className="w-10 h-10 rounded-full border-2 border-white/20" 
              referrerPolicy="no-referrer" 
            />
            <div className="font-medium text-sm md:text-base">{blog.author.name}</div>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 text-sm text-white/90 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
              <span className="font-bold">{blog.totalReactions ?? 0}</span> Reactions
            </div>
            
            <Link 
              to={`/blog/${blog.id}`} 
              className="px-6 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] rounded-sm font-semibold transition-colors text-sm md:text-base text-center"
            >
              Read more
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
