import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/authService';
import { ArrowRight, Lock, User, Mail, AtSign, Phone } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function Signup() {
  const [data, setData] = useState({ phoneNumber: "", username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const submit = async (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(data.phoneNumber)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }
    setLoading(true);
    try {
      await registerUser(data);
      toast.success("Account created successfully! Please login.");
      navigate('/login');
    } catch (error) {
      const resData = error.response?.data;
      const msg = resData?.message || (typeof resData === 'string' ? resData : "Registration failed");
      toast.error(msg);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] animate-fade-in">

        {/* Left Side - Image/Brand Area */}
        <div className="hidden md:flex md:w-1/2 bg-gray-900 relative items-center justify-center p-12 overflow-hidden order-2">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
              alt="Fashion Style"
              className="w-full h-full object-cover opacity-60 scale-105 hover:scale-110 transition-transform duration-[20s] ease-in-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>

          <div className="relative z-10 text-white space-y-6 text-right">
            <h2 className="text-5xl font-serif font-bold animate-slide-up">Join the Elite</h2>
            <p className="text-gray-200 text-lg ml-auto max-w-md animate-slide-up delay-100">
              Be part of our exclusive community. Get early access to new arrivals, special offers, and personalized style recommendations.
            </p>
          </div>
        </div>

        {/* Right Side - Form Area */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white relative order-1">
          <div className="max-w-md mx-auto w-full space-y-8">
            <div className="text-center md:text-left animate-slide-in-right">
              <h1 className="text-2xl md:text-4xl font-serif font-bold text-gray-900 mb-2">Create Account</h1>
              <p className="text-gray-500">Start your fashion journey with us today.</p>
            </div>

            <form onSubmit={submit} className="space-y-5 animate-slide-in-right delay-100">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AtSign className="h-5 w-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                </div>
                <input
                  className="w-full pl-10 pr-4 py-3 md:py-4 border-b-2 border-gray-200 bg-gray-50 rounded-t-lg focus:bg-white focus:border-primary-600 focus:outline-none transition-all duration-300 placeholder-gray-400 font-medium"
                  placeholder="Username"
                  value={data.username}
                  onChange={(e) => setData({ ...data, username: e.target.value })}
                  required
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                </div>
                <input
                  type="tel"
                  className="w-full pl-10 pr-4 py-3 md:py-4 border-b-2 border-gray-200 bg-gray-50 rounded-t-lg focus:bg-white focus:border-primary-600 focus:outline-none transition-all duration-300 placeholder-gray-400 font-medium"
                  placeholder="Phone Number"
                  value={data.phoneNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setData({ ...data, phoneNumber: val });
                  }}
                  required
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                </div>
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-3 md:py-4 border-b-2 border-gray-200 bg-gray-50 rounded-t-lg focus:bg-white focus:border-primary-600 focus:outline-none transition-all duration-300 placeholder-gray-400 font-medium"
                  placeholder="Email Address"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  required
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                </div>
                <input
                  type="password"
                  className="w-full pl-10 pr-4 py-3 md:py-4 border-b-2 border-gray-200 bg-gray-50 rounded-t-lg focus:bg-white focus:border-primary-600 focus:outline-none transition-all duration-300 placeholder-gray-400 font-medium"
                  placeholder="Password"
                  value={data.password}
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                  required
                />
              </div>

              <button
                disabled={loading}
                className={`w-full bg-primary-600 text-white py-3 md:py-4 rounded-xl font-semibold text-base md:text-lg hover:bg-primary-700 transition-all transform hover:-translate-y-1 active:scale-95 shadow-lg flex items-center justify-center gap-2 group ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? "Creating Account..." : (
                  <>
                    Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-8 animate-slide-in-right delay-200">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-600 font-bold hover:underline transition-all">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
