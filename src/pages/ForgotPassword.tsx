import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Send } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isSupabaseConfigured) {
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (resetErr) {
        setError(resetErr.message);
        setLoading(false);
        return;
      }
    }

    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-100/40 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/login" className="inline-flex items-center gap-2 text-xs text-teal-600 dark:text-teal-400 hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
        </Link>
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Reset Password
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-zinc-400">
          Enter your account email to receive instructions for resetting your password
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white dark:bg-zinc-900 py-8 px-6 sm:px-10 shadow-xl rounded-2xl border border-gray-100 dark:border-zinc-800">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Password Reset Sent
              </h3>
              <p className="mt-2 text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">
                If an account exists for <strong className="text-teal-600 dark:text-teal-400">{email}</strong>, you will receive an email with reset instructions shortly.
              </p>
              <Link
                to="/login"
                className="mt-6 inline-block w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors"
              >
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold text-sm shadow-md shadow-teal-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Reset Link</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
