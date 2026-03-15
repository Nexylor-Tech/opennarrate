import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-8 mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-[var(--muted-foreground)]">
          &copy; {new Date().getFullYear()} Open Narrate. All rights reserved.
        </div>
        <div className="flex items-center gap-6 text-sm font-medium text-[var(--muted-foreground)]">
          <Link to="/" className="hover:text-[var(--foreground)] transition-colors">About</Link>
          <Link to="/" className="hover:text-[var(--foreground)] transition-colors">Pricing</Link>
          <Link to="/" className="hover:text-[var(--foreground)] transition-colors">Privacy</Link>
          <Link to="/" className="hover:text-[var(--foreground)] transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  );
}

