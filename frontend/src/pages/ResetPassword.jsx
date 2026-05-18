import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { Eye, EyeOff, Lock, XCircle, CheckCircle } from 'lucide-react';
import './Auth.css'; // Reuse Auth styles for visual consistency

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Invalid or expired reset link. Please request a new one.');
      toast.error('Reset token is missing');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError('Password must be at least 8 characters long and contain at least one uppercase letter and one number.');
      toast.error('Weak password');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post(
        '/auth/reset-password',
        { password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess(true);
      toast.success('Password reset successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
      toast.error('Reset failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F5F7] relative overflow-hidden font-sans">
      {/* Background Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-[#7F5DF4] opacity-20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-[#4A0E4E] opacity-20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-item item-1">🔑</div>
        <div className="floating-item item-3">🔒</div>
        <div className="floating-item item-5">🛡️</div>
      </div>

      <div className="auth-container flex items-center justify-center p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 max-w-md w-full relative z-10">
        <div className="w-full space-y-6 text-[#1A1F3A]">
          <div className="text-center">
            <h1 className="text-3xl font-bold font-serif text-[#1A1F3A] mb-2">Reset Password</h1>
            <p className="text-gray-500 text-sm">Create a secure new password for your account</p>
          </div>

          {!token && (
            <div className="bg-red-50 text-red-500 p-4 rounded-lg flex items-start space-x-3 border border-red-200">
              <XCircle className="flex-shrink-0 mt-0.5" size={20} />
              <div className="text-sm">
                <span className="font-semibold block">Missing Token</span>
                This reset link is invalid. Please return to the login page and click "Forgot Password" to receive a new link.
              </div>
            </div>
          )}

          {success ? (
            <div className="bg-green-50 text-green-600 p-6 rounded-lg text-center border border-green-200 space-y-3 animate-fade-in">
              <CheckCircle className="mx-auto text-green-500" size={48} />
              <h2 className="text-lg font-bold">Success!</h2>
              <p className="text-sm text-green-700">Your password has been successfully updated. Redirecting you to the login page...</p>
            </div>
          ) : (
            token && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 text-red-500 p-3 rounded-lg flex items-start space-x-3 border border-red-200">
                    <XCircle className="flex-shrink-0 mt-0.5" size={18} />
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                )}

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="New Password"
                    className="w-full bg-white border border-gray-200 rounded-lg py-3 pl-10 pr-10 text-[#1A1F3A] placeholder-gray-400 focus:outline-none focus:border-[#7F5DF4] transition-colors"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
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
                    placeholder="Confirm New Password"
                    className="w-full bg-white border border-gray-200 rounded-lg py-3 pl-10 pr-4 text-[#1A1F3A] placeholder-gray-400 focus:outline-none focus:border-[#7F5DF4] transition-colors"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#7F5DF4] text-white py-3 rounded-lg font-semibold hover:bg-[#6b4ae0] transition-colors shadow-lg shadow-[#7F5DF4]/20 mt-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            )
          )}

          <div className="text-center pt-2">
            <Link to="/login" className="text-sm text-gray-500 hover:text-[#7F5DF4] font-medium transition-colors">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
