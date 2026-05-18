import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { Eye, EyeOff, Lock, Mail, User, Phone, XCircle } from 'lucide-react';
import './Auth.css';

const Auth = ({ initialMode = 'login' }) => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(initialMode === 'signup');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuth();

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Signup State
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError('');
    try {
      await login(loginEmail, loginPassword);
      toast.success('Welcome back!');
      
      const pendingTemplate = sessionStorage.getItem('pending_template');
      if (pendingTemplate) {
        navigate('/dashboard/generate');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      setLoginError(error.response?.data?.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (signupPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (signupPassword.length < 8 || !/[A-Z]/.test(signupPassword) || !/[0-9]/.test(signupPassword)) {
      toast.error('Password must be at least 8 characters long and contain at least one uppercase letter and one number.');
      return;
    }

    if (!signupPhone.trim()) {
      toast.error('Phone number is required');
      return;
    }

    const cleanPhone = signupPhone.replace(/[\s\-()]/g, '');
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(cleanPhone)) {
      toast.error('Please enter a valid phone number (must contain between 10 and 15 digits)');
      return;
    }

    setIsSubmitting(true);
    try {
      await register(fullName, signupEmail, signupPassword, signupPhone);
      toast.success('Account created successfully! Please sign in.');
      setLoginEmail(signupEmail);
      setIsRightPanelActive(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F5F7] relative overflow-hidden font-sans">
      {/* Background Blobs for Glassmorphism */}
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-[#7F5DF4] opacity-20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-[#4A0E4E] opacity-20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[40%] right-[20%] w-64 h-64 bg-[#00B4D8] opacity-15 rounded-full blur-3xl"></div>

      {/* Floating Animated Letters/Documents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-item item-1">📄</div>
        <div className="floating-item item-2">✉️</div>
        <div className="floating-item item-3">📝</div>
        <div className="floating-item item-4">📄</div>
        <div className="floating-item item-5">✉️</div>
        <div className="floating-item item-6">📝</div>
        <div className="floating-item item-7">📄</div>
        <div className="floating-item item-8">✉️</div>
        <div className="floating-item item-9">📝</div>
        <div className="floating-item item-10">📄</div>
        <div className="floating-item item-11">📝</div>
        <div className="floating-item item-12">📄</div>
        <div className="floating-item item-13">✉️</div>
        <div className="floating-item item-14">📝</div>
        <div className="floating-item item-15">📄</div>
      </div>

      <div className={`auth-container ${isRightPanelActive ? 'right-panel-active' : ''}`}>
        
        {/* Sign Up Container */}
        <div className="form-container sign-up-container flex flex-col justify-center items-center p-10 text-[#1A1F3A]">
          <form onSubmit={handleSignupSubmit} className="w-full max-w-sm space-y-4">
            <h1 className="text-3xl font-bold text-center mb-2 font-serif text-[#1A1F3A]">Create Account</h1>
            <p className="text-gray-500 text-center text-sm mb-6">Join us to create ATS-ready cover letters</p>
            
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Full Name" 
                className="w-full bg-white border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-[#1A1F3A] placeholder-gray-400 focus:outline-none focus:border-[#7F5DF4] transition-colors"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full bg-white border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-[#1A1F3A] placeholder-gray-400 focus:outline-none focus:border-[#7F5DF4] transition-colors"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Phone (+91 00000 00000)" 
                className="w-full bg-white border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-[#1A1F3A] placeholder-gray-400 focus:outline-none focus:border-[#7F5DF4] transition-colors"
                value={signupPhone}
                onChange={(e) => setSignupPhone(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                className="w-full bg-white border border-gray-200 rounded-lg py-2.5 pl-10 pr-10 text-[#1A1F3A] placeholder-gray-400 focus:outline-none focus:border-[#7F5DF4] transition-colors"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#7F5DF4]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="password" 
                placeholder="Confirm Password" 
                className="w-full bg-white border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-[#1A1F3A] placeholder-gray-400 focus:outline-none focus:border-[#7F5DF4] transition-colors"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#7F5DF4] text-white py-2.5 rounded-lg font-semibold hover:bg-[#6b4ae0] transition-colors mt-4 shadow-lg shadow-[#7F5DF4]/20"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>
        </div>

        {/* Sign In Container */}
        <div className="form-container sign-in-container flex flex-col justify-center items-center p-10 text-[#1A1F3A]">
          <form onSubmit={handleLoginSubmit} className="w-full max-w-sm space-y-5">
            <h1 className="text-3xl font-bold text-center mb-2 font-serif text-[#1A1F3A]">Welcome Back</h1>
            <p className="text-gray-500 text-center text-sm mb-6">Sign in to your account</p>
            
            {loginError && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg flex items-center space-x-3 border border-red-200 animate-bounce">
                <XCircle size={20} className="text-red-500" />
                <span className="text-sm font-medium">{loginError}</span>
              </div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full bg-white border border-gray-200 rounded-lg py-3 pl-10 pr-4 text-[#1A1F3A] placeholder-gray-400 focus:outline-none focus:border-[#7F5DF4] transition-colors"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full bg-white border border-gray-200 rounded-lg py-3 pl-10 pr-4 text-[#1A1F3A] placeholder-gray-400 focus:outline-none focus:border-[#7F5DF4] transition-colors"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>

            <div className="text-right">
              <button 
                type="button" 
                onClick={async () => {
                  if(!loginEmail) return toast.error('Please enter your email first');
                  try {
                    const res = await api.post('/auth/forgot-password', { email: loginEmail });
                    toast.success(res.data.message);
                    if (res.data.link) {
                      console.log("🔑 [CareerForge Dev Mode] Password Reset Link:", res.data.link);
                      // Auto-redirect to the reset password page for easy local testing
                      const url = new URL(res.data.link);
                      setTimeout(() => {
                        navigate(`${url.pathname}${url.search}`);
                      }, 1500); // 1.5s delay so the user can read the success toast
                    }
                  } catch (error) {
                    toast.error(error.response?.data?.message || 'Failed to send reset link');
                  }
                }} 
                className="text-sm text-gray-500 hover:text-[#7F5DF4] transition-colors">
                Forgot password?
              </button>
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#7F5DF4] text-white py-3 rounded-lg font-semibold hover:bg-[#6b4ae0] transition-colors shadow-lg shadow-[#7F5DF4]/20"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Overlay Container */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1 className="text-3xl font-bold mb-4 font-serif">Welcome Back!</h1>
              <p className="mb-8 text-sm text-gray-200">Sign in to access your saved letters and generate new ones.</p>
              <button 
                className="w-40 border-2 border-white text-white py-2.5 rounded-lg font-semibold hover:bg-white hover:text-[#7F5DF4] transition-colors"
                onClick={() => setIsRightPanelActive(false)}
              >
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1 className="text-3xl font-bold mb-4 font-serif">Land Your Dream Job</h1>
              <p className="mb-8 text-sm text-gray-200">Create your highly optimized, ATS-friendly cover letter in seconds.</p>
              <button 
                className="w-40 border-2 border-white text-white py-2.5 rounded-lg font-semibold hover:bg-white hover:text-[#7F5DF4] transition-colors"
                onClick={() => setIsRightPanelActive(true)}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Auth;
