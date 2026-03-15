import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import type { Blog } from "../types";
import { MessageSquare, Share2, Bookmark, ChevronDown, Smile } from "lucide-react";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import { useSession } from "../lib/auth-client";

const REACTIONS = [
  { emoji: "👍", label: "like" },
  { emoji: "❤️", label: "love" },
  { emoji: "🔥", label: "fire" },
  { emoji: "👏", label: "clap" },
  { emoji: "😢", label: "sad" },
];

export function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [reaction, setReaction] = useState<string | null>(null);
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({});
  const [totalReactions, setTotalReactions] = useState(0);
  const [isReactionOpen, setIsReactionOpen] = useState(false);

  useEffect(() => {
    const loadBlog = async () => {
      if (id) {
        setLoading(true);
        const data = await api.getBlogById(id);
        setBlog(data || null);
        setLoading(false);
      }
    };
    loadBlog();
  }, [id]);

  useEffect(() => {
    const loadReactions = async () => {
      if (blog?.id) {
        const data = await api.getReactions(blog.id);
        if (data) {
          setReactionCounts(data.counts || {});
          setTotalReactions(data.total || 0);
          setReaction(data.myReaction || null);
        }
      }
    };
    loadReactions();
  }, [blog?.id, session]);

  const headings = useMemo(() => {
    if (!blog?.content) return [];
    const headingLines = blog.content.match(/^#{1,3}\s+(.+)$/gm) || [];
    return headingLines.map(line => {
      const text = line.replace(/^#{1,3}\s+/, '').trim();
      const id = text.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/[\s_-]+/g, '-');
      return { text, id };
    });
  }, [blog?.content]);

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-sm animate-spin" /></div>;
  }

  if (!blog) {
    return <div className="text-center py-20 text-2xl font-bold">Blog not found</div>;
  }

  const currentEmoji = reaction ? REACTIONS.find(r => r.label === reaction)?.emoji : null;
  const topReactions = Object.entries(reactionCounts)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([label]) => REACTIONS.find(r => r.label === label)?.emoji)
    .filter(Boolean);

  const displayedReactions = Array.from(new Set([...topReactions, currentEmoji].filter(Boolean)));

  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Update URL hash without jumping
      window.history.pushState(null, '', `#${id}`);
    }
  };

  return (
    <article className="max-w-6xl mx-auto pb-20">
      {/* Hero Section */}
      <header className="relative w-full h-[500px] lg:h-[600px] rounded-sm overflow-hidden shadow-xl mb-16 flex items-end border border-[var(--border)] mt-8">
        <div className="absolute inset-0">
          <img 
            src={blog.coverImage} 
            alt={blog.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
        </div>

        <div className="relative z-10 w-full p-8 md:p-12 space-y-4 md:space-y-6">
          <div className="flex items-center gap-2 text-[var(--primary)] font-bold text-sm tracking-wider uppercase drop-shadow">
            <span className="w-2 h-2 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]" />
            {blog.category}
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-white drop-shadow-lg">
            {blog.title}
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl drop-shadow">
            {blog.excerpt}
          </p>
          
          <div className="flex items-center gap-4 pt-4">
            <img 
              src={blog.author.avatar} 
              alt={blog.author.name} 
              className="w-12 h-12 rounded-full object-cover border-2 border-white/20 shadow-sm"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="font-bold text-white drop-shadow">{blog.author.name}</div>
              <div className="text-sm text-white/70 drop-shadow">
                Published {format(new Date(blog.createdAt), 'dd MMM yyyy')}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">
        {/* Sticky Table of Contents */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24 space-y-8">
            {headings.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-4">Table of Contents</h3>
                <nav className="space-y-1">
                  {headings.map((heading, i) => (
                    <a 
                      key={i} 
                      href={`#${heading.id}`}
                      onClick={(e) => handleScrollToSection(e, heading.id)}
                      className={`block py-2 text-sm font-medium border-b border-[var(--border)] flex items-center justify-between group ${i === 0 ? 'text-[var(--primary)]' : 'text-[var(--foreground)] hover:text-[var(--primary)]'}`}
                    >
                      <span className="flex items-center gap-2">
                        {i === 0 && <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />}
                        {heading.text}
                      </span>
                      <ChevronDown size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ))}
                </nav>
              </div>
            )}
            
            <div className="flex items-center gap-4 text-[var(--muted-foreground)]">
              <button className="hover:text-[var(--foreground)] transition-colors"><Share2 size={18} /></button>
              <button className="hover:text-[var(--foreground)] transition-colors"><Bookmark size={18} /></button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-9 max-w-none">
          <div className="prose prose-lg dark:prose-invert max-w-none font-serif text-lg leading-relaxed text-[var(--foreground)]/90">
            <ReactMarkdown rehypePlugins={[rehypeSlug]}>{blog.content}</ReactMarkdown>
          </div>
          
          <div className="flex items-center gap-6 mt-12 pt-8 border-t border-[var(--border)]">
            <div className="relative flex items-center">
              <button 
                onClick={() => {
                  if (!session) return;
                  setIsReactionOpen(!isReactionOpen);
                }}
                disabled={!session}
                className={`flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors font-medium py-2 ${!session ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={!session ? "Log in to react" : "React to this post"}
              >
                {currentEmoji ? <span className="text-xl leading-none">{currentEmoji}</span> : <Smile size={20} />} 
                <span className="flex items-center gap-1.5 ml-1">
                  <span className="flex -space-x-1">
                    {displayedReactions.map((r, i) => (
                      <span key={i} className="text-xs bg-[var(--muted)] border border-[var(--background)] w-6 h-6 flex items-center justify-center rounded-full z-10">{r as string}</span>
                    ))}
                  </span>
                  <span>{totalReactions}</span>
                </span>
              </button>
              
              {/* Reaction Popover */}
              {isReactionOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-0" 
                    onClick={() => setIsReactionOpen(false)}
                  />
                  <div className="absolute bottom-full left-0 mb-2 flex items-center gap-2 bg-[var(--card)] border border-[var(--border)] shadow-lg rounded-full px-4 py-2 z-10 animate-in fade-in slide-in-from-bottom-2">
                    {REACTIONS.map((r) => (
                      <button
                        key={r.label}
                        onClick={async (e) => {
                          e.stopPropagation();
                          const newReaction = r.label === reaction ? null : r.label;
                          setReaction(newReaction);
                          setIsReactionOpen(false);
                          
                          if (newReaction) {
                            await api.addReaction(blog.id, newReaction);
                          } else {
                            await api.removeReaction(blog.id);
                          }
                          
                          const data = await api.getReactions(blog.id);
                          if (data) {
                            setReactionCounts(data.counts || {});
                            setTotalReactions(data.total || 0);
                            setReaction(data.myReaction || null);
                          }
                        }}
                        className={`text-2xl hover:-translate-y-1 hover:scale-110 transition-all origin-bottom px-1 ${reaction === r.label ? 'scale-110 -translate-y-1' : ''}`}
                        title={r.label}
                      >
                        {r.emoji}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button className="flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors font-medium py-2">
              <MessageSquare size={20} /> {blog.comments.length} Comments
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
