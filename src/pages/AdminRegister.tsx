import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminRegister: React.FC = () => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [specialization, setSpecialization] = useState('Clinical Psychologist');
  const [experience, setExperience] = useState('5 Years');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    const res = await signUp({
      fullname,
      email,
      password,
      role: 'Specialist'
    });
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      setSuccess(true);
      setTimeout(() => {
        navigate('/specialist/dashboard');
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-teal-950 text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/admin/login" className="inline-flex items-center gap-2 text-xs text-teal-400 hover:text-teal-300 mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Specialist Login</span>
        </Link>
        <div className="w-16 h-16 rounded-2xl bg-teal-500/20 border border-teal-500/30 text-teal-400 mx-auto flex items-center justify-center mb-3">
          <UserPlus className="w-9 h-9" />
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight">
          Register Specialist Account
        </h2>
        <p className="mt-2 text-xs text-zinc-400">
          Create an accredited mental health specialist practitioner account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-zinc-900/90 backdrop-blur-md py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border border-zinc-800">
          {success ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-emerald-950/60 border border-emerald-700 text-emerald-400 mx-auto flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold">Specialist Registered!</h3>
              <p className="mt-1 text-xs text-zinc-400">
                Opening specialist workspace...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Doctor / Practitioner Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    required
                    placeholder="e.g. Dr. Maria Santos, PhD"
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-800/80 border border-zinc-700 rounded-xl text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Professional Email Address
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
                    placeholder="dr.santos@mindcare.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-800/80 border border-zinc-700 rounded-xl text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Specialization
                  </label>
                  <select
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="w-full px-3 py-2.5 bg-zinc-800/80 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="Clinical Psychologist">Clinical Psychologist</option>
                    <option value="Psychiatrist">Psychiatrist</option>
                    <option value="Counselor">Counselor</option>
                    <option value="Therapist">Therapist</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Experience
                  </label>
                  <input
                    type="text"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="e.g. 8 Years"
                    className="w-full px-3 py-2.5 bg-zinc-800/80 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
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
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-800/80 border border-zinc-700 rounded-xl text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-800/80 border border-zinc-700 rounded-xl text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-white"
                  />
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
                    <UserPlus className="w-4 h-4" />
                    <span>Create Specialist Account</span>
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
