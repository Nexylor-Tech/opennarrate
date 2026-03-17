import type { Blog } from "./types";
import { authClient } from "./lib/auth-client";

const API_URL = "http://localhost:3000";

// Helper to map backend blog format to frontend Blog format
function mapBlog(data: any): Blog {
  return {
    id: data.slug || data.id, // Use slug for routing if available
    title: data.title,
    excerpt: data.excerpt || "No excerpt provided.",
    content: data.content,
    coverImage: data.coverImageUrl || "https://picsum.photos/seed/async/1200/800",
    author: {
      id: data.author?.id || "unknown",
      name: data.author?.name || "Unknown Author",
      avatar: data.author?.image || "https://picsum.photos/seed/orlando/100/100",
      bio: "Writer.",
    },
    category: data.category || "Technology",
    createdAt: data.createdAt || new Date().toISOString(),
    views: Math.floor(Math.random() * 1000), // Mock
    likes: data.totalReactions ?? data.reactions?.length ?? (data.reactionsCount?.heart || 0),
    shares: 0,
    comments: [],
    featured: false,
  };
}

export const api = {
  getFeaturedBlogs: async (): Promise<Blog[]> => {
    try {
      const res = await fetch(`${API_URL}/blogs?published=true`);
      if (!res.ok) return [];
      const json = await res.json();
      return (json.data || []).map(mapBlog);
    } catch {
      return [];
    }
  },
  getRecentBlogs: async (): Promise<Blog[]> => {
    try {
      const res = await fetch(`${API_URL}/blogs?published=true`);
      if (!res.ok) return [];
      const json = await res.json();
      return (json.data || []).map(mapBlog);
    } catch {
      return [];
    }
  },
  getBestBlogs: async (_timeframe: 'month' | 'year'): Promise<Blog[]> => {
    try {
      const res = await fetch(`${API_URL}/blogs?published=true`);
      if (!res.ok) return [];
      const json = await res.json();
      return (json.data || []).map(mapBlog);
    } catch {
      return [];
    }
  },
  getBlogById: async (id: string): Promise<Blog | undefined> => {
    try {
      const res = await fetch(`${API_URL}/blogs/${id}`);
      if (!res.ok) return undefined;
      const data = await res.json();
      return mapBlog(data);
    } catch {
      return undefined;
    }
  },
  getUserBlogs: async (): Promise<Blog[]> => {
    try {
      const { data: session } = await authClient.getSession();
      if (!session) return [];
      const res = await authClient.$fetch(`${API_URL}/blogs/mine`);
      if (res.error) return [];
      const json = res.data as any;
      return (json.data || []).map(mapBlog);
    } catch {
      return [];
    }
  },
  createBlog: async (data: { title: string, content: string, category: string, excerpt?: string, published?: boolean, coverImageKey?: string, coverImageUrl?: string }) => {
    const res = await authClient.$fetch(`${API_URL}/blogs/`, {
       method: "POST",
       body: data
    });
    return res;
  },
  uploadImage: async (blogID: string, file: File) => {
    // 1. Get presigned URL
    const presignRes = await authClient.$fetch(`${API_URL}/images/presign`, {
      method: "POST",
      body: {
        blogID,
        fileName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
      }
    });

    if (presignRes.error) {
      throw new Error(presignRes.error.message || "Failed to get upload URL");
    }

    const { uploadURL, publicURL, key } = presignRes.data as any;

    // 2. Upload file to storage
    const uploadRes = await fetch(uploadURL, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!uploadRes.ok) {
      throw new Error("Failed to upload file to storage");
    }

    // 3. Confirm upload
    const confirmRes = await authClient.$fetch(`${API_URL}/images/confirm`, {
      method: "POST",
      body: {
        blogID,
        key,
        url: publicURL,
        fileName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
      }
    });

    if (confirmRes.error) {
      throw new Error(confirmRes.error.message || "Failed to confirm upload");
    }

    return { key, url: publicURL };
  },
  getReactions: async (slug: string): Promise<any> => {
    try {
      const res = await authClient.$fetch(`${API_URL}/reactions/${slug}`);
      return res.data as any;
    } catch {
      return null;
    }
  },
  addReaction: async (slug: string, reaction: string) => {
    const res = await authClient.$fetch(`${API_URL}/reactions/${slug}`, {
      method: "POST",
      body: { reaction }
    });
    return res;
  },
  removeReaction: async (slug: string) => {
    const res = await authClient.$fetch(`${API_URL}/reactions/${slug}`, {
      method: "DELETE"
    });
    return res;
  }
};

