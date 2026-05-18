import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../api/axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-accent opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent opacity-10 rounded-full blur-3xl"></div>
      
      <div className="card w-full max-w-md z-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-serif font-bold text-accent flex items-center justify-center space-x-2">
            <img src="/favicon.png" alt="Logo" className="w-8 h-8 flex-shrink-0" />
            <span>Cover Letter Generator</span>
          </Link>
          <h2 className="text-3xl font-bold mt-6 mb-2">Welcome Back</h2>
          <p className="text-textMuted">Sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <input 
              type="email" 
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <label className="block text-sm font-medium">Password</label>
              <button 
                type="button" 
                onClick={async () => {
                  if(!email) return toast.error('Please enter your email first');
                  try {
                    const res = await api.post('/auth/forgot-password', { email });
                    toast.success(res.data.message);
                    if (res.data.link) {
                      console.log("🔑 [CareerForge Dev Mode] Password Reset Link:", res.data.link);
                      // Auto-redirect to the reset password page for easy local testing
                      const url = new URL(res.data.link);
                      setTimeout(() => {
                        navigate(`${url.pathname}${url.search}`);
                      }, 1500);
                    }
                  } catch (error) {
                    toast.error(error.response?.data?.message || 'Failed to send reset link');
                  }
                }} 
                className="text-sm text-accent hover:underline bg-transparent border-none p-0 cursor-pointer">
                Forgot password?
              </button>
            </div>
            <input 
              type="password" 
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-primary w-full py-3"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Temporarily commented out social logins
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-base text-textMuted">or sign in with these providers</span>
          </div>
        </div>

        <div className="space-y-3">
          <button 
            type="button"
            onClick={() => toast.success('Google login clicked! (Requires Google Client ID in production)')}
            className="w-full flex items-center justify-center bg-white text-gray-900 py-2.5 px-4 rounded-md font-medium hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
          
          <button 
            type="button"
            onClick={() => toast.success('GitHub login clicked! (Requires GitHub Client ID in production)')}
            className="w-full flex items-center justify-center bg-[#24292F] text-white py-2.5 px-4 rounded-md font-medium hover:bg-[#24292F]/90 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.101 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
            </svg>
            Continue with GitHub
          </button>
        </div>
        */}
        
        <div className="mt-8 text-center text-sm text-textMuted">
          Don't have an account? <Link to="/signup" className="text-accent hover:underline font-medium">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
