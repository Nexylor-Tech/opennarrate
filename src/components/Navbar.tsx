import { Link, useNavigate } from "react-router-dom";
import { Moon, Sun, PenSquare, LogOut } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useSession, signOut } from "../lib/auth-client";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[var(--foreground)] flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-[var(--background)]" />
          </div>
          <span className="font-bold text-xl tracking-tight">Open Narrate</span>
        </Link>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-[var(--muted)] transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {session ? (
            <div className="flex items-center gap-4">
              <Link to="/add-blog" className="flex items-center gap-1.5 text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                <PenSquare size={18} />
                <span className="hidden md:inline">Write</span>
              </Link>
              <Link to="/profile" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-[var(--border)]">
                  <img src={session.user.image || "https://picsum.photos/seed/default/100/100"} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              </Link>
              <button 
                onClick={handleSignOut}
                className="p-2 rounded-full hover:bg-[var(--muted)] transition-colors text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                aria-label="Sign out"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link 
              to="/login"
              className="hidden md:inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-sm bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 transition-opacity"
            >
              Log in / Sign up
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
