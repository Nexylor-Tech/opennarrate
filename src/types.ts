export interface User {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  createdAt: string;
  likes: number;
}

export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string; // Markdown or HTML string
  coverImage: string;
  author: User;
  category: string;
  createdAt: string;
  views: number;
  likes: number;
  shares: number;
  comments: Comment[];
  featured?: boolean;
  totalReactions?: number;
}

