import { Link } from "react-router-dom";
import type { Blog } from "../types";
import { format } from "date-fns";
import { ThumbsUp, MessageSquare, Eye } from "lucide-react";

interface BlogCardProps {
  blog: Blog;
  featured?: boolean;
}

export function BlogCard({ blog, featured = false }: BlogCardProps) {
  if (featured) {
    return (
      <Link to={`/blog/${blog.id}`} className="group block relative rounded-sm overflow-hidden h-full">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute bottom-0 left-0 right-0 p-8 z-20 text-white">
          <div className="flex items-center gap-2 text-white/80 font-medium text-xs tracking-wider uppercase mb-3">
            <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />
            {blog.category}
          </div>
          <h3 className="text-3xl md:text-4xl leading-tight mb-4 group-hover:text-[var(--primary)] transition-colors line-clamp-2">
            {blog.title}
          </h3>
          <p className="text-white/70 line-clamp-2 mb-6 max-w-2xl">
            {blog.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={blog.author.avatar} alt={blog.author.name} className="w-10 h-10 rounded-full border-2 border-white/20" referrerPolicy="no-referrer" />
              <div className="">
                <div className="font-semibold text-sm">{blog.author.name}</div>
                <div className="text-xs text-white/60">{format(new Date(blog.createdAt), 'MMM d, yyyy')}</div>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-sm text-white/80">
              <div className="flex items-center gap-1.5"><Eye size={16} /> {blog.views}</div>
              <div className="flex items-center gap-1.5"><ThumbsUp size={16} /> {blog.likes}</div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/blog/${blog.id}`} className="group block h-full flex flex-col bg-[var(--card)] border border-[var(--border)] rounded-sm overflow-hidden hover:border-[var(--primary)]/50 hover:shadow-lg hover:shadow-[var(--primary)]/5 transition-all duration-300">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4">
          <span className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-black/50 backdrop-blur-md text-white rounded-full  inline-block">
            {blog.category}
          </span>
        </div>
        </div>
        <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold leading-tight mb-3 group-hover:text-[var(--primary)] transition-colors line-clamp-2 ">
          {blog.title}
        </h3>
        <p className="text-[var(--muted-foreground)] text-base line-clamp-3 mb-6 flex-grow leading-relaxed">
          {blog.excerpt}
        </p>

        <div className="flex items-center justify-between  border-t border-[var(--border)] mt-auto">
          <div className="flex items-center gap-3">
            <img src={blog.author.avatar} alt={blog.author.name} className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
            <div className="text-sm font-medium ">{blog.author.name}</div>
          </div>
          <div className="flex items-center gap-4 text-[var(--muted-foreground)] text-sm font-medium ">
            <div className="flex items-center gap-1.5"><ThumbsUp size={16} /> {blog.likes}</div>
            <div className="flex items-center gap-1.5"><MessageSquare size={16} /> {blog.comments?.length || 0}</div>
          </div>
        </div>
        </div>    </Link>
  );
}
