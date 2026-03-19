import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { MoreVertical, Edit2, Trash2 } from "lucide-react";
import type { Comment } from "../types";

interface CommentCardProps {
  comment: Comment;
  currentUserId?: string | null;
  onEdit: (id: string, newContent: string) => void;
  onDelete: (id: string) => void;
}

export function CommentCard({ comment, currentUserId, onEdit, onDelete }: CommentCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isOwner = currentUserId === comment.authorId;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSave = () => {
    if (editContent.trim() && editContent !== comment.content) {
      onEdit(comment.id, editContent);
    }
    setIsEditing(false);
  };

  return (
    <div className="group relative flex gap-4 p-4 border-b border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)]/20 transition-colors rounded-sm">
      <img
        src={comment.author.image || "https://picsum.photos/seed/default/100/100"}
        alt={comment.author.name}
        className="w-10 h-10 rounded-full object-cover shrink-0 border border-[var(--border)]"
        referrerPolicy="no-referrer"
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{comment.author.name}</span>
            <span className="text-xs text-[var(--muted-foreground)]">
              {format(new Date(comment.createdAt), 'MMM d, yyyy')}
            </span>
          </div>

          {isOwner && (
            <div className="relative flex items-center" ref={menuRef}>
              {/* Desktop hover actions */}
              <div className="hidden sm:group-hover:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-1.5 text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-sm transition-colors"
                  title="Edit"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => onDelete(comment.id)}
                  className="p-1.5 text-[var(--muted-foreground)] hover:text-red-500 hover:bg-red-500/10 rounded-sm transition-colors"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Mobile triple dot menu */}
              <div className="sm:hidden">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] rounded-sm"
                >
                  <MoreVertical size={16} />
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-full mt-1 w-32 bg-[var(--card)] border border-[var(--border)] rounded-sm shadow-lg z-10 py-1">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-[var(--muted)] flex items-center gap-2"
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    <button
                      onClick={() => {
                        onDelete(comment.id);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-[var(--muted)] flex items-center gap-2"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="mt-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full min-h-[80px] p-3 text-sm bg-[var(--background)] border border-[var(--border)] rounded-sm focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] resize-y"
              placeholder="Edit your comment..."
              autoFocus
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(comment.content);
                }}
                className="px-3 py-1.5 text-xs font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!editContent.trim()}
                className="px-3 py-1.5 text-xs font-medium bg-[var(--primary)] text-[var(--primary-foreground)] rounded-sm hover:bg-[var(--primary)]/90 transition-colors disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-[var(--foreground)]/90 whitespace-pre-wrap break-words mt-1">
            {comment.content}
          </p>
        )}
      </div>
    </div>
  );
}
