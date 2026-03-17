import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api";
import { useSession, authClient } from "../lib/auth-client";
import { Image as ImageIcon, Eye, Edit2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import { format } from "date-fns";

const CATEGORIES = [
  { slug: "technology", label: "Technology" },
  { slug: "programming", label: "Programming" },
  { slug: "design", label: "Design" },
  { slug: "career", label: "Career" },
  { slug: "personal", label: "Personal" },
];

export function AddBlog() {
  const { data: session } = useSession();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("technology");
  const [published, setPublished] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editId) {
      setLoading(true);
      api.getBlogById(editId).then(blog => {
        if (blog) {
          setTitle(blog.title);
          setExcerpt(blog.excerpt);
          setContent(blog.content);
          setCategory(blog.category || "technology");
          // If we want to support existing cover image previews, we'd set it here
          if (blog.coverImage && blog.coverImage !== "https://picsum.photos/seed/async/1200/800") {
            setCoverImagePreview(blog.coverImage);
          }
        }
        setLoading(false);
      }).catch(() => {
        setError("Failed to load blog for editing");
        setLoading(false);
      });
    }
  }, [editId]);

  // If not logged in, redirect or show message
  if (session === null) {
    return <div className="text-center py-20">Please log in to add a blog.</div>;
  }

  useEffect(() => {
    return () => {
      if (coverImagePreview && !coverImagePreview.startsWith("http")) URL.revokeObjectURL(coverImagePreview);
    };
  }, [coverImagePreview]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setCoverImage(file);
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let blogId = editId;

      if (editId) {
        // Update existing blog
        const patchRes = await authClient.$fetch(`http://localhost:3000/blogs/${editId}`, {
          method: "PATCH",
          body: {
            title,
            excerpt,
            content,
            category,
            published: coverImage ? undefined : published, // Only update published if not uploading image (handled later)
          }
        });
        if (patchRes.error) throw new Error(patchRes.error.message || "Failed to update blog");
      } else {
        // Create new blog
        const res = await api.createBlog({
          title,
          excerpt,
          content,
          category,
          // Publish later if there is an image, otherwise respect user choice
          published: coverImage ? false : published,
        });

        if (res.error) {
          throw new Error(res.error.message || "Failed to create blog");
        }

        const newBlog = (res.data as any)?.data as any;

        if (!newBlog || !newBlog.id) {
          throw new Error("Invalid response from server");
        }
        blogId = newBlog.id;
      }

      let patchData: any = {};
      let needsPatch = false;

      // 2. If there's a cover image, upload it
      if (coverImage && blogId) {
        try {
          const { key, url } = await api.uploadImage(blogId, coverImage);
          patchData.coverImageKey = key;
          patchData.coverImageUrl = url;
          needsPatch = true;
        } catch (uploadErr: any) {
          setError(`Blog saved but image upload failed: ${uploadErr.message}`);
          setLoading(false);
          return;
        }
      }

      // 3. Patch the blog if we have an image or if we deferred publishing
      if (coverImage && published && blogId) {
        patchData.published = true;
        needsPatch = true;
      }

      if (needsPatch && blogId) {
        const patchRes = await authClient.$fetch(`http://localhost:3000/blogs/${blogId}`, {
          method: "PATCH",
          body: patchData
        });

        if (patchRes.error) {
          setError(`Blog saved but failed to update with image: ${patchRes.error.message}`);
          setLoading(false);
          return;
        }
      }

      // Navigate to the new blog
      navigate(`/blog/${blogId}`);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{editId ? "Edit Blog" : "Write a New Blog"}</h1>
        <button
          type="button"
          onClick={() => setShowPreviewMobile(!showPreviewMobile)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 border border-[var(--border)] rounded-sm hover:bg-[var(--muted)] transition-colors"
        >
          {showPreviewMobile ? <><Edit2 size={16} /> Edit</> : <><Eye size={16} /> Preview</>}
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className={showPreviewMobile ? "hidden lg:block" : "block"}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-base font-medium mb-1">Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-[var(--border)] rounded-sm bg-[var(--background)]  focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                placeholder="Enter a catchy title..."
              />
            </div>

            <div>
              <label className="block text-base font-medium mb-2">Category</label>
              <div className="flex flex-wrap gap-3">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => setCategory(cat.slug)}
                    className={`px-5 py-3 rounded-sm text-sm font-medium transition-colors border   ${category === cat.slug
                      ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                      : "border-[var(--border)] bg-[var(--background)] hover:bg-[var(--muted)]"
                      }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-base font-medium mb-1">Cover Image (Optional)</label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-5 py-3 border border-[var(--border)] rounded-sm hover:bg-[var(--muted)] transition-colors  "
                >
                  <ImageIcon size={18} className="" />
                  {coverImage ? "Change Image" : "Upload Image"}
                </button>
                <span className="text-sm text-[var(--muted-foreground)] ">
                  {coverImage ? coverImage.name : (coverImagePreview ? "Existing Image" : "No file chosen")}
                </span>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={handleImageChange}
              />
            </div>

            <div>
              <label className="block text-base font-medium mb-1">Excerpt (Optional)</label>
              <input
                type="text"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full px-4 py-3 border border-[var(--border)] rounded-sm bg-[var(--background)]  focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                placeholder="Brief summary..."
              />
            </div>
            <div>
              <label className="block text-base font-medium mb-1">Content (Markdown)</label>
              <textarea
                required
                rows={15}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-3 border border-[var(--border)] rounded-sm bg-[var(--background)] font-mono text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                placeholder="Write your content here..."
              />
            </div>
            <div className="flex items-center gap-2 ">
              <input
                type="checkbox"
                id="published"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="published" className="text-base font-medium ">Publish immediately</label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-[var(--foreground)] text-[var(--background)] text-sm font-medium rounded-sm hover:opacity-90 disabled:opacity-50  "
            >
              {loading ? "Saving..." : (editId ? "Update Blog" : "Create Blog")}
            </button>
          </form>
        </div>

        {/* Preview Pane */}
        <div className={`border border-[var(--border)] rounded-sm p-6 lg:p-8 bg-[var(--card)] sticky top-24 h-fit max-h-[80vh] overflow-y-auto ${showPreviewMobile ? "block" : "hidden lg:block"}`}>
          <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-6 flex items-center gap-2">
            <Eye size={14} /> Preview
          </h2>

          <article className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <header className="relative w-full aspect-video rounded-sm overflow-hidden shadow-xl mb-8 flex items-end border border-[var(--border)] bg-neutral-800">
              <div className="absolute inset-0">
                {coverImagePreview && (
                  <img
                    src={coverImagePreview}
                    alt="Cover preview"
                    className="w-full h-full object-cover !m-0"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
              </div>

              <div className="relative z-10 w-full p-6 space-y-4">
                <div className="inline-block px-4 py-2 mb-2 text-xs font-bold uppercase tracking-wider bg-[var(--primary)] text-white rounded-sm  ">
                  {CATEGORIES.find(c => c.slug === category)?.label || category}
                </div>
                <h1 className="text-2xl md:text-3xl font-black leading-[1.1] tracking-tight text-white drop-shadow-lg !mb-0">
                  {title || <span className="opacity-50">Your Blog Title</span>}
                </h1>

                {excerpt && (
                  <p className="text-base text-white/90 leading-relaxed max-w-3xl drop-shadow !mt-2 !mb-0">
                    {excerpt}
                  </p>
                )}

                <div className="flex items-center gap-3 ">
                  <img
                    src={session?.user?.image || "https://picsum.photos/seed/default/100/100"}
                    alt="Author"
                    className="w-10 h-10 rounded-full object-cover border-2 border-white/20 shadow-sm !m-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="font-bold text-white drop-shadow text-sm leading-tight">{session?.user?.name || "Author Name"}</div>
                    <div className="text-xs text-white/70 drop-shadow">
                      Published {format(new Date(), 'dd MMM yyyy')}
                    </div>
                  </div>
                </div>
              </div>
            </header>

            <div className=" prose-lg text-[var(--foreground)]/90 leading-relaxed">
              {content ? (
                <ReactMarkdown rehypePlugins={[rehypeSlug]}>{content}</ReactMarkdown>
              ) : (
                <p className="text-[var(--muted-foreground)] italic opacity-50">Your markdown content will appear here...</p>
              )}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
