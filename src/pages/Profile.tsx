import { useState, useEffect } from "react";
import { useTheme } from "../components/ThemeProvider";
import { Settings, Edit3, BookOpen, Edit2, Heart, LayoutDashboard } from "lucide-react";
import { useSession } from "../lib/auth-client";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api";
import type { Blog } from "../types";
import { Dashboard } from "../components/Dashboard";

export function Profile() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'write' | 'blogs' | 'settings'>('dashboard');
  const [userBlogs, setUserBlogs] = useState<Blog[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const { theme, setTheme } = useTheme();
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending && !session) {
      navigate("/login");
    }
  }, [session, isPending, navigate]);

  useEffect(() => {
    if ((activeTab === 'blogs' || activeTab === 'dashboard') && userBlogs.length === 0 && !loadingBlogs) {
      setLoadingBlogs(true);
      api.getUserBlogs().then(blogs => {
        setUserBlogs(blogs);
      }).finally(() => {
        setLoadingBlogs(false);
      });
    }
  }, [activeTab]);

  if (isPending || !session) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const user = session.user;
  
  const totalBlogs = userBlogs.length;
  const totalLikes = userBlogs.reduce((acc, blog) => acc + blog.likes, 0);

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
            
            <nav className="space-y-3">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-3 px-5 py-4 rounded-sm text-base font-medium transition-colors   ${activeTab === 'dashboard' ? 'bg-[var(--primary)] text-white' : 'hover:bg-[var(--muted)]'}`}
              >
                <LayoutDashboard size={18} className="" /> Dashboard
              </button>
              <button 
                onClick={() => navigate('/add-blog')}
                className={`w-full flex items-center gap-3 px-5 py-4 rounded-sm text-base font-medium transition-colors hover:bg-[var(--muted)]  `}
              >
                <Edit3 size={18} className="" /> Write Blog
              </button>
              <button 
                onClick={() => setActiveTab('blogs')}
                className={`w-full flex items-center gap-3 px-5 py-4 rounded-sm text-base font-medium transition-colors   ${activeTab === 'blogs' ? 'bg-[var(--primary)] text-white' : 'hover:bg-[var(--muted)]'}`}
              >
                <BookOpen size={18} className="" /> My Blogs
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-5 py-4 rounded-sm text-base font-medium transition-colors   ${activeTab === 'settings' ? 'bg-[var(--primary)] text-white' : 'hover:bg-[var(--muted)]'}`}
              >
                <Settings size={18} className="" /> Settings
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-[var(--card)] border border-[var(--border)] rounded-sm p-8 min-h-[600px]">
          {activeTab === 'dashboard' && (
            loadingBlogs ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <Dashboard totalBlogs={totalBlogs} totalLikes={totalLikes} />
            )
          )}

          {activeTab === 'blogs' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">My Blogs</h2>
              {loadingBlogs ? (
                <div className="flex justify-center py-20">
                  <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : userBlogs.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {userBlogs.map(blog => (
                    <div key={blog.id} className="group flex items-center p-5 border border-[var(--border)] rounded-sm bg-[var(--background)] hover:border-[var(--primary)]/50 transition-colors relative">
                      <div className="w-24 h-24 shrink-0 overflow-hidden rounded-sm mr-5">
                        <img 
                          src={blog.coverImage} 
                          alt={blog.title} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0 pr-12">
                        <Link to={`/blog/${blog.id}`} className="text-xl font-bold hover:text-[var(--primary)] truncate block ">
                          {blog.title}
                        </Link>
                        <div className="flex items-center gap-4 text-base text-[var(--muted-foreground)] mt-2  ">
                          <span className="capitalize">{blog.category}</span>
                          <div className="flex items-center gap-1.5">
                            <Heart size={16} className="" /> 
                            {blog.likes}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => navigate(`/add-blog?edit=${blog.id}`)}
                        className="absolute right-5 p-3 text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:bg-[var(--muted)] rounded-full opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                        title="Edit Blog"
                      >
                        <Edit2 size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-[var(--muted-foreground)]">
                  <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
                  <p>You haven't published any blogs yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold mb-6 ">User Settings</h2>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b border-[var(--border)] pb-3 ">Appearance</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-lg  ">Theme Preference</div>
                    <div className="text-base text-[var(--muted-foreground)]  ">Choose your preferred theme</div>
                  </div>
                  <select 
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
                    className="px-5 py-3 rounded-sm border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]   text-base"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b border-[var(--border)] pb-3 ">Profile Information</h3>
                <div>
                  <label className="block text-base font-medium mb-2  ">Display Name</label>
                  <input type="text" defaultValue={user.name} className="w-full px-4 py-3 rounded-sm border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]  text-base" />
                </div>
                <div>
                  <label className="block text-base font-medium mb-2  ">Email</label>
                  <input type="email" disabled defaultValue={user.email} className="w-full px-4 py-3 rounded-sm border border-[var(--border)] bg-[var(--muted)] text-[var(--muted-foreground)] focus:outline-none cursor-not-allowed  text-base" />
                </div>
                <button className="px-8 py-4 bg-[var(--foreground)] text-[var(--background)] text-base font-medium rounded-sm hover:opacity-90 transition-opacity  ">
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
