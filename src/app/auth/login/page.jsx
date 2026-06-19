"use client";
import React, { useEffect, useState } from "react";
import { Eye, EyeOff, ArrowRight, ShieldAlert } from "lucide-react";
import { Link } from "@heroui/react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data, error: authError } = await authClient.signIn.email({
        email: formData.email, 
        password: formData.password, 
        rememberMe: true,
      });

      if (authError) {
        toast.error(authError.message || "Something went wrong");
        setTimeout(() => {
          router.push("/auth/signup");
        }, 1000);
        return;
      }

      toast.success("Welcome to Qylentra 🎉");
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);

    } catch (err) {
      setError("Invalid authorization credentials. Access Denied.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/", 
      });
    } catch (err) {
      toast.error("Social authentication failed.");
    }
  };

  useEffect(() => {
    async function checkSession() {
      try {
        const { data } = await authClient.getSession();

        if (!data?.user) return;

        switch (data.user.role) {
          case "lawyer":
            router.replace("/dashboard/lawyer");
            break;
          case "admin":
            router.replace("/dashboard/admin");
            break;
          default:
            router.replace("/");
        }
      } catch (err) {
        console.error("Session verification failed", err);
      }
    }

    checkSession();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-[#F3F4F6] font-sans flex flex-col justify-between selection:bg-[#FF9500] selection:text-black">
      <main className="flex-1 flex items-center justify-center px-4 py-12 ">
        <div className="w-full max-w-md border border-gray-900 rounded-sm overflow-hidden shadow-2xl bg-[#0C0D0F] p-8 lg:p-10">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#FF9500] font-semibold mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF9500]"></span>
              Secure Network Portal
            </div>
            <h2 className="font-serif text-2xl lg:text-3xl font-normal tracking-tight text-white">
              LogIn to LexVizo
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Enter your credentials to access your account securely.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-950/30 border border-red-900/50 rounded-sm flex items-center gap-2 text-xs text-red-400">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full py-3 px-4 border border-gray-800 rounded-sm bg-[#0A0B0D] hover:bg-[#121418] hover:border-gray-700 transition flex items-center justify-center gap-3 text-sm font-medium text-gray-300"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Authenticate via Google
          </button>

          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-950"></div>
            </div>
            <span className="relative bg-[#0C0D0F] px-3 text-[10px] uppercase tracking-widest text-gray-600">
              Secure Protocol
            </span>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5">
                Identity Vector (Email)
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-[#0A0B0D] border border-gray-800 rounded-sm px-4 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-[#FF9500] transition"
                placeholder="vance@enterprise.com"
              />
            </div>

            <div className="relative">
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs uppercase tracking-wider text-gray-400">
                  Secret Key (Password)
                </label>
                <a
                  href="#forgot"
                  className="text-[11px] text-gray-500 hover:text-[#FF9500] transition"
                >
                  Recovery?
                </a>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-[#0A0B0D] border border-gray-800 rounded-sm px-4 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-[#FF9500] transition pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8.5 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-white hover:bg-gray-100 disabled:bg-gray-800 disabled:text-gray-600 text-black text-xs font-semibold uppercase tracking-widest py-3 px-4 rounded-sm transition flex items-center justify-center gap-2 group"
            >
              {isLoading ? "Processing Authorization..." : "Verify Identity"}
              {!isLoading && (
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              )}
            </button>
          </form>

          <div className="mt-8 text-center pt-4 border-t border-gray-950">
            <p className="text-xs text-gray-500">
              Don't have an account? {"   "}
              <Link
                href="/auth/signup"
                className="text-white hover:text-[#FF9500] underline underline-offset-4 transition"
              >
                Register now
              </Link>
            </p>
          </div>
        </div>
      </main>
      <footer className="px-6 lg:px-16 py-6 border-t border-gray-900 text-center flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#0A0B0D]">
        <div className="text-[10px] uppercase tracking-wider text-gray-600">
          &copy; 2026 LexVizo Systems Node.
        </div>
      </footer>
    </div>
  );
};

export default Login;