import { useState } from "react";
import { Send } from "lucide-react";

interface CommentAddProps {
  onSubmit: (content: string) => Promise<void>;
  userAvatar?: string;
}

export function CommentAdd({ onSubmit, userAvatar }: CommentAddProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content);
      setContent("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 p-4 border border-[var(--border)] bg-[var(--card)] rounded-sm mt-6 mb-8">
      <img
        src={userAvatar || "https://picsum.photos/seed/default/100/100"}
        alt="Current user"
        className="w-10 h-10 rounded-full object-cover shrink-0 border border-[var(--border)] hidden sm:block"
        referrerPolicy="no-referrer"
      />
      <div className="flex-1">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a comment... (Emojis are welcome ✨)"
          className="w-full min-h-[100px] p-3 text-sm bg-[var(--background)] border border-[var(--border)] rounded-sm focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] resize-y mb-2"
          disabled={isSubmitting}
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[var(--primary)] text-[var(--primary-foreground)] rounded-sm hover:bg-[var(--primary)]/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <>Posting...</>
            ) : (
              <>
                <Send size={16} /> Post Comment
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
