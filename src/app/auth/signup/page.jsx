"use client";
import React, { useState } from "react";
import { Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState("");
  const [step, setStep] = useState(1);
  const router = useRouter();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setStep(2);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await authClient.signUp.email({
      name: formData.fullName,
      email: formData.email,
      password: formData.password,
      role: role,
    });

    if (error) {
      toast.error(error.message || "Registration failed");
      return;
    }

    toast.success("Account created successfully 🎉");
    router.push("/auth/login");
  };
  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-[#F3F4F6] font-sans flex flex-col justify-between selection:bg-[#FF9500] selection:text-black">
      <main className="flex-1 flex items-center justify-center px-4 py-12 lg:py-20">
        <div className="w-full max-w-5xl grid md:grid-cols-12 gap-0 border border-gray-900 rounded-sm overflow-hidden shadow-2xl bg-[#0C0D0F]">
      
          <div className="md:col-span-5 p-8 lg:p-12 bg-linear-to-br from-[#0F1115] to-[#07080A] flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-900">
            <div>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#FF9500] font-semibold mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF9500]"></span>
                Vanguard Legal Group
              </div>
              <h2 className="font-serif text-3xl lg:text-4xl font-normal leading-tight tracking-tight text-white mb-4">
                Join the Architecture of{" "}
                <span className="text-gray-400 italic">Modern Law.</span>
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                Access elite counsel, data-driven analytics, and secure legal
                management environments.
              </p>
            </div>

            <div className="mt-12 md:mt-0 pt-6 border-t border-gray-900 flex items-center gap-3">
              <div className="p-2 border border-gray-800 rounded bg-[#0A0B0D]">
                <ShieldCheck className="w-5 h-5 text-[#FF9500]" />
              </div>
              <div className="text-[11px] text-gray-500 uppercase tracking-wider">
                Enterprise-Grade JWT Encryption Secure
              </div>
            </div>
          </div>

      
          <div className="md:col-span-7 p-8 lg:p-12 flex flex-col justify-center">
        
            {step === 1 && (
              <div>
                <div className="mb-8">
                  <div className="text-[10px] uppercase tracking-[0.15em] text-[#FF9500] font-medium mb-1">
                    // Initialization
                  </div>
                  <h3 className="text-xl font-medium text-white">
                    Create Account
                  </h3>
                </div>

      
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
                  Continue with Google
                </button>

                <div className="relative my-6 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-950"></div>
                  </div>
                  <span className="relative bg-[#0C0D0F] px-3 text-[10px] uppercase tracking-widest text-gray-600">
                    Or credentials
                  </span>
                </div>

                <form onSubmit={handleNextStep} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full bg-[#0A0B0D] border border-gray-800 rounded-sm px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF9500] transition"
                      placeholder="Alexander Vance"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5">
                      Corporate Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-[#0A0B0D] border border-gray-800 rounded-sm px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF9500] transition"
                      placeholder="vance@enterprise.com"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5">
                        Password
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full bg-[#0A0B0D] border border-gray-800 rounded-sm px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF9500] transition pr-10"
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

                    <div className="relative">
                      <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5">
                        Confirm Password
                      </label>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        required
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full bg-[#0A0B0D] border border-gray-800 rounded-sm px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF9500] transition pr-10"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-8.5 text-gray-500 hover:text-gray-300"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-6 bg-white hover:bg-gray-100 text-black text-xs font-semibold uppercase tracking-widest py-3 px-4 rounded-sm transition flex items-center justify-center gap-2 group"
                  >
                    Continue to Role Selection
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </div>
            )}

         
            {step === 2 && (
              <div>
                <div className="mb-6">
                  <div className="text-[10px] uppercase tracking-[0.15em] text-[#FF9500] font-medium mb-1">
                    // Global Strategy
                  </div>
                  <h3 className="text-xl font-medium text-white">
                    Select Your Vector
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Configure your workspace access identity.
                  </p>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
                    <div
                      onClick={() => setRole("client")}
                      className={`cursor-pointer p-5 border rounded-sm transition-all flex flex-col justify-between h-40 bg-[#0A0B0D] ${
                        role === "client"
                          ? "border-[#FF9500] ring-1 ring-[#FF9500]"
                          : "border-gray-800 hover:border-gray-700"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span
                          className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-sm border ${
                            role === "client"
                              ? "border-[#FF9500] text-[#FF9500]"
                              : "border-gray-800 text-gray-500"
                          }`}
                        >
                          01
                        </span>
                        <div
                          className={`w-3 h-3 rounded-full border flex items-center justify-center ${role === "client" ? "border-[#FF9500]" : "border-gray-700"}`}
                        >
                          {role === "client" && (
                            <div className="w-1.5 h-1.5 rounded-full bg-[#FF9500]" />
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-1">
                          Client / User
                        </h4>
                        <p className="text-[11px] text-gray-400 leading-normal">
                          Find trusted lawyers, manage your legal cases, and
                          connect with experienced legal professionals—all in
                          one secure platform.
                        </p>
                      </div>
                    </div>

         
                    <div
                      onClick={() => setRole("lawyer")}
                      className={`cursor-pointer p-5 border rounded-sm transition-all flex flex-col justify-between h-40 bg-[#0A0B0D] ${
                        role === "lawyer"
                          ? "border-[#FF9500] ring-1 ring-[#FF9500]"
                          : "border-gray-800 hover:border-gray-700"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span
                          className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-sm border ${
                            role === "lawyer"
                              ? "border-[#FF9500] text-[#FF9500]"
                              : "border-gray-800 text-gray-500"
                          }`}
                        >
                          02
                        </span>
                        <div
                          className={`w-3 h-3 rounded-full border flex items-center justify-center ${role === "lawyer" ? "border-[#FF9500]" : "border-gray-700"}`}
                        >
                          {role === "lawyer" && (
                            <div className="w-1.5 h-1.5 rounded-full bg-[#FF9500]" />
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-1">
                          Legal Architect
                        </h4>
                        <p className="text-[11px] text-gray-400 leading-normal">
                          Manage your clients, handle legal cases, showcase your
                          expertise, and grow your legal practice on a trusted
                          platform.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-950">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs uppercase tracking-wider text-gray-500 hover:text-gray-300 transition"
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      disabled={!role}
                      className={`px-6 py-3 text-xs font-semibold uppercase tracking-widest rounded-sm transition-all ${
                        role
                          ? "bg-[#FF9500] hover:bg-[#e08300] text-black shadow-lg shadow-[#FF9500]/10"
                          : "bg-gray-900 text-gray-600 cursor-not-allowed"
                      }`}
                    >
                      Complete Architecture
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500">
                Already have an account? {" "}
                <Link
                  href="/auth/login"
                  className="text-white hover:text-[#FF9500] underline underline-offset-4 transition"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="px-6 lg:px-16 py-6 border-t border-gray-900 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4 bg-[#0A0B0D]">
        <div className="text-[10px] uppercase tracking-wider text-gray-600">
          &copy; 2026 LexVizo Global Strategy / Private Practice.
        </div>
        <div className="flex gap-6 text-[10px] uppercase tracking-wider text-gray-600">
          <a href="#privacy" className="hover:text-gray-400">
            Governance Policy
          </a>
          <a href="#terms" className="hover:text-gray-400">
            Terms of Service
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Register;
