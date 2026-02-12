import React, { useState, useEffect } from "react";
import { X, User, Lock, Mail, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { loginUser, registerUser, googleLogin } from "../services/authService";
import { safeSessionStorage } from "../utils/storage";
import { GoogleLogin } from '@react-oauth/google';

export default function AuthModal() {
    const { user, login } = useAuth();
    const toast = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState("login"); // 'login' or 'signup'
    const [formData, setFormData] = useState({ username: "", email: "", password: "", confirmPassword: "", name: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Show modal after 3 seconds if not logged in and hasn't been shown in this session
        const hasShown = safeSessionStorage.getItem("authModalShown");
        if (!user && !hasShown) {
            const timer = setTimeout(() => {
                setIsOpen(true);
                safeSessionStorage.setItem("authModalShown", "true");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [user]);

    // Close if user logs in externally (e.g. from page)
    useEffect(() => {
        if (user) setIsOpen(false);
    }, [user]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (mode === "login") {
                const res = await loginUser({ username: formData.username, password: formData.password });
                login(res, false); // Use sessionStorage for Safari compatibility
                toast.success("Welcome back! Login successful.");
                setIsOpen(false);
            } else {
                if (formData.password !== formData.confirmPassword) {
                    toast.error("Passwords do not match");
                    setLoading(false);
                    return;
                }
                await registerUser({
                    username: formData.username,
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                });
                // Auto login after signup or just switch to login? Let's switch to login for clarity or auto-login flow.
                // For now, switch to login mode to force fresh login or auto-login flow.
                const res = await loginUser({ username: formData.username, password: formData.password });
                login(res, false); // Use sessionStorage for Safari compatibility
                toast.success("Account created successfully! Welcome to Sheshri.");
                setIsOpen(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        try {
            const res = await googleLogin(credentialResponse.credential);
            login(res, false);
            toast.success("Welcome! Logged in with Google.");
            setIsOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Google login failed");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleError = () => {
        toast.error("Google login failed. Please try again.");
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative animate-scale-up">
                {/* Close Button */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition"
                >
                    <X size={20} />
                </button>

                <div className="p-8">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                            {mode === "login" ? "Welcome Back" : "Join Sheshri"}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {mode === "login"
                                ? "Login to access your personalized wishlist and orders."
                                : "Create an account to unlock exclusive benefits."}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === "signup" && (
                            <div className="relative group">
                                <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-primary-600 rounded-lg outline-none transition"
                                    required
                                />
                            </div>
                        )}

                        <div className="relative group">
                            <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-primary-600 rounded-lg outline-none transition"
                                required
                            />
                        </div>

                        {mode === "signup" && (
                            <div className="relative group">
                                <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-primary-600 rounded-lg outline-none transition"
                                    required
                                />
                            </div>
                        )}

                        <div className="relative group">
                            <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-primary-600 rounded-lg outline-none transition"
                                required
                            />
                        </div>

                        {mode === "signup" && (
                            <div className="relative group">
                                <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-primary-600 rounded-lg outline-none transition"
                                    required
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2"
                        >
                            {loading ? "Processing..." : (
                                <>
                                    {mode === "login" ? "Login" : "Sign Up"} <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-4 w-full">
                            <div className="w-full google-login-wrapper">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={handleGoogleError}
                                    theme="filled_black"
                                    size="large"
                                    text="continue_with"
                                    shape="rectangular"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        {mode === "login" ? (
                            <p>
                                New user?{" "}
                                <button onClick={() => setMode("signup")} className="text-primary-600 font-bold hover:underline">
                                    Sign up here
                                </button>
                            </p>
                        ) : (
                            <p>
                                Already have an account?{" "}
                                <button onClick={() => setMode("login")} className="text-primary-600 font-bold hover:underline">
                                    Login here
                                </button>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
