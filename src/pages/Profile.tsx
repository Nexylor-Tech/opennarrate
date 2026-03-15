import { useState, useEffect } from "react";
import { useTheme } from "../components/ThemeProvider";
import { Settings, Edit3, BookOpen } from "lucide-react";
import { useSession } from "../lib/auth-client";
import { useNavigate } from "react-router-dom";

export function Profile() {
  const [activeTab, setActiveTab] = useState<'write' | 'blogs' | 'settings'>('write');
  const { theme, setTheme } = useTheme();
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending && !session) {
      navigate("/login");
    }
  }, [session, isPending, navigate]);

  if (isPending || !session) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const user = session.user;

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-sm p-6 sticky top-24">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[var(--background)] shadow-md mb-4">
                <img 
                  src={user.image || "https://picsum.photos/seed/default/200/200"} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-sm text-[var(--muted-foreground)]">{user.email}</p>
            </div>
            
            <nav className="space-y-2">
              <button 
                onClick={() => navigate('/add-blog')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium transition-colors hover:bg-[var(--muted)]`}
              >
                <Edit3 size={18} /> Write Blog
              </button>
              <button 
                onClick={() => setActiveTab('blogs')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium transition-colors ${activeTab === 'blogs' ? 'bg-[var(--primary)] text-white' : 'hover:bg-[var(--muted)]'}`}
              >
                <BookOpen size={18} /> My Blogs
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-[var(--primary)] text-white' : 'hover:bg-[var(--muted)]'}`}
              >
                <Settings size={18} /> Settings
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-[var(--card)] border border-[var(--border)] rounded-sm p-8 min-h-[600px]">
          {activeTab === 'blogs' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">My Published Blogs</h2>
              <div className="text-center py-20 text-[var(--muted-foreground)]">
                <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
                <p>You haven't published any blogs yet.</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold mb-6">User Settings</h2>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b border-[var(--border)] pb-2">Appearance</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Theme Preference</div>
                    <div className="text-sm text-[var(--muted-foreground)]">Choose your preferred theme</div>
                  </div>
                  <select 
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
                    className="px-4 py-2 rounded-sm border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b border-[var(--border)] pb-2">Profile Information</h3>
                <div>
                  <label className="block text-sm font-medium mb-2">Display Name</label>
                  <input type="text" defaultValue={user.name} className="w-full px-4 py-2 rounded-sm border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input type="email" disabled defaultValue={user.email} className="w-full px-4 py-2 rounded-sm border border-[var(--border)] bg-[var(--muted)] text-[var(--muted-foreground)] focus:outline-none cursor-not-allowed" />
                </div>
                <button className="px-6 py-2 bg-[var(--foreground)] text-[var(--background)] font-medium rounded-sm hover:opacity-90 transition-opacity">
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
