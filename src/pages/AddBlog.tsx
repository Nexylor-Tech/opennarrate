import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useSession, authClient } from "../lib/auth-client";
import { Image as ImageIcon } from "lucide-react";

export function AddBlog() {
  const { data: session } = useSession();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // If not logged in, redirect or show message
  if (session === null) {
    return <div className="text-center py-20">Please log in to add a blog.</div>;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCoverImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Create the blog first to get an ID
      const res = await api.createBlog({
        title,
        excerpt,
        content,
        // Publish later if there is an image, otherwise respect user choice
        published: coverImage ? false : published, 
      });

      if (res.error) {
        throw new Error(res.error.message || "Failed to create blog");
      }

      const newBlog = res.data?.data as any;

      if (!newBlog || !newBlog.id) {
        throw new Error("Invalid response from server");
      }

      let patchData: any = {};
      let needsPatch = false;

      // 2. If there's a cover image, upload it
      if (coverImage) {
        try {
          const { key, url } = await api.uploadImage(newBlog.id, coverImage);
          patchData.coverImageKey = key;
          patchData.coverImageUrl = url;
          needsPatch = true;
        } catch (uploadErr: any) {
          setError(`Blog created but image upload failed: ${uploadErr.message}`);
          setLoading(false);
          return;
        }
      }

      // 3. Patch the blog if we have an image or if we deferred publishing
      if (coverImage && published) {
        patchData.published = true;
        needsPatch = true;
      }

      if (needsPatch) {
        const patchRes = await authClient.$fetch(`http://localhost:3000/blogs/${newBlog.id}`, {
          method: "PATCH",
          body: patchData
        });
        
        if (patchRes.error) {
           setError(`Blog created but failed to update with image: ${patchRes.error.message}`);
           setLoading(false);
           return;
        }
      }
      
      // Navigate to the new blog
      navigate(`/blog/${newBlog.slug || newBlog.id}`);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Write a New Blog</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-[var(--border)] rounded-md bg-[var(--background)]"
            placeholder="Enter a catchy title..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Cover Image (Optional)</label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 border border-[var(--border)] rounded-md hover:bg-[var(--muted)] transition-colors"
            >
              <ImageIcon size={18} />
              {coverImage ? "Change Image" : "Upload Image"}
            </button>
            <span className="text-sm text-[var(--muted-foreground)]">
              {coverImage ? coverImage.name : "No file chosen"}
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
          <label className="block text-sm font-medium mb-1">Excerpt (Optional)</label>
          <input
            type="text"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full px-3 py-2 border border-[var(--border)] rounded-md bg-[var(--background)]"
            placeholder="Brief summary..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Content (Markdown)</label>
          <textarea
            required
            rows={15}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border border-[var(--border)] rounded-md bg-[var(--background)] font-mono text-sm"
            placeholder="Write your content here..."
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="published"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          <label htmlFor="published" className="text-sm font-medium">Publish immediately</label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-[var(--foreground)] text-[var(--background)] font-medium rounded-md hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Create Blog"}
        </button>
      </form>
    </div>
  );
}
