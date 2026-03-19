export interface User {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    image?: string;
  };
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

