import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, googleLogin } from '../services/authService';
import { ArrowRight, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();

  const [rememberMe, setRememberMe] = useState(false);

  /* Add showPassword state */
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.warning('Please enter username and password');
      return;
    }

    try {
      setLoading(true);
      const res = await loginUser({ username, password });

      login(res, rememberMe); // Pass rememberMe state
      toast.success(`Welcome back, ${res.user.username}!`);

      if (res.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const res = await googleLogin(credentialResponse.credential);
      login(res, rememberMe);
      toast.success('Welcome! Logged in with Google.');

      if (res.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Google login error:', error);
      toast.error(error.response?.data?.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error('Google login failed. Please try again.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] animate-fade-in">

        {/* Left Side - Image/Brand Area */}
        <div className="hidden md:flex md:w-1/2 bg-gray-900 relative items-center justify-center p-12 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-60 scale-105 hover:scale-110 transition-transform duration-[20s] ease-in-out"
            >
              <source src="/images/video login.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>

          <div className="relative z-10 text-white space-y-6">
            <h2 className="text-5xl font-serif font-bold animate-slide-up">Elegance Redefined</h2>
            <p className="text-gray-200 text-lg max-w-md animate-slide-up delay-100">
              Log in to access your curated collection of timeless fashion pieces designed for the modern woman.
            </p>
          </div>
        </div>

        {/* Right Side - Form Area */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white relative">
          <div className="max-w-md mx-auto w-full space-y-8">
            <div className="text-center md:text-left animate-slide-in-right">
              <h1 className="text-2xl md:text-4xl font-serif font-bold text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-gray-500">Please enter your details to sign in.</p>
            </div>

            <form noValidate onSubmit={handleLogin} className="space-y-6 animate-slide-in-right delay-100">
              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full pl-10 pr-4 py-3 md:py-4 border-b-2 border-gray-200 bg-gray-50 rounded-t-lg focus:bg-white focus:border-primary-600 focus:outline-none transition-all duration-300 placeholder-gray-400 font-medium"
                    required
                  />
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full pl-10 pr-12 py-3 md:py-4 border-b-2 border-gray-200 bg-gray-50 rounded-t-lg focus:bg-white focus:border-primary-600 focus:outline-none transition-all duration-300 placeholder-gray-400 font-medium"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-2 rounded text-primary-600 focus:ring-primary-500"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember me
                </label>
                <Link to="/forgot-password" className="text-primary-600 hover:text-primary-800 font-medium transition-colors">Forgot Password?</Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gray-900 text-white py-3 md:py-4 rounded-xl font-semibold text-base md:text-lg hover:bg-black transition-all transform hover:-translate-y-1 active:scale-95 shadow-lg flex items-center justify-center gap-2 group ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Authenticating...' : (
                  <>
                    Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">Or continue with</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <div className="mt-2 w-full">
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
            </form>

            <div className="text-center mt-6 animate-slide-in-right delay-200">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary-600 font-bold hover:underline transition-all">
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
