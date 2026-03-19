import { useState } from "react";
import { signIn, signUp } from "../lib/auth-client";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      if (isLogin) {
        const { data, error: authError } = await signIn.email({
          email,
          password,
        });
        if (authError) throw new Error(authError.message);
        if (data) navigate("/");
      } else {
        const { data, error: authError } = await signUp.email({
          email,
          password,
          name,
        });
        if (authError) throw new Error(authError.message);
        if (data) navigate("/");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: window.location.origin,
      });
    } catch (err: any) {
      setError(err.message || "Google sign in failed");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[var(--card)] p-8 rounded-sm border border-[var(--border)] shadow-sm">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-[var(--foreground)]">
            {isLogin ? "Sign in to your account" : "Create an account"}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-[var(--border)] rounded-sm bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] "
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-[var(--border)] rounded-sm bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] "
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-[var(--border)] rounded-sm bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] "
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-[var(--border)] rounded-sm bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] "
                />
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-sm shadow-sm text-base font-medium text-[var(--background)] bg-[var(--foreground)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]  "
            >
              {isLogin ? "Sign in" : "Sign up"}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border)]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[var(--card)] text-[var(--muted-foreground)] ">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex justify-center py-4 px-4 border border-[var(--border)] rounded-sm shadow-sm bg-[var(--background)] text-base font-medium text-[var(--foreground)] hover:bg-[var(--muted)]  "
            >
              Google
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-base font-medium text-[var(--primary)] hover:underline "
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
