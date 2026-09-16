import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ShieldCheck, AlertCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both specialist email and password.');
      return;
    }

    setLoading(true);
    // Sign in with preferred specialist role
    const res = await signIn(email, password, 'Specialist');
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      navigate('/specialist/dashboard', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-teal-950 text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 text-xs text-teal-400 hover:text-teal-300 mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <div className="w-16 h-16 rounded-2xl bg-teal-500/20 border border-teal-500/30 text-teal-400 mx-auto flex items-center justify-center mb-3">
          <ShieldCheck className="w-9 h-9" />
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight">
          Specialist & Admin Portal
        </h2>
        <p className="mt-2 text-xs text-zinc-400">
          Sign in to manage appointments, clinical reviews, and consultation schedules
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-zinc-900/90 backdrop-blur-md py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border border-zinc-800">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Specialist / Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="specialist@mindcare.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-800/80 border border-zinc-700 rounded-xl text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-zinc-800/80 border border-zinc-700 rounded-xl text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm shadow-md shadow-teal-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Access Clinical Dashboard</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-zinc-800 text-center space-y-2">
            <Link
              to="/admin/register"
              className="block text-xs text-teal-400 hover:underline font-medium"
            >
              Register a New Specialist Account
            </Link>
            <Link
              to="/login"
              className="block text-xs text-zinc-500 hover:text-zinc-400"
            >
              Return to Patient Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
