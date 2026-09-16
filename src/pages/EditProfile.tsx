import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Calendar, ArrowLeft, Save, AlertCircle, CheckCircle2, Image } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const EditProfile: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [fullname, setFullname] = useState(profile?.fullname || '');
  const [age, setAge] = useState<number | ''>(profile?.age || '');
  const [gender, setGender] = useState(profile?.gender || 'Male');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await updateProfile({
      fullname,
      age: age ? Number(age) : null,
      gender,
      phone,
      bio,
      avatar_url: avatarUrl
    });

    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      setSuccess(true);
      setTimeout(() => {
        navigate('/profile');
      }, 1000);
    }
  };

  return (
    <div className="main-wrapper">
      <div className="max-w-2xl space-y-6 pb-16">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-zinc-400 hover:text-teal-600 dark:hover:text-teal-400"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Profile</span>
      </button>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm p-6 sm:p-8 space-y-6">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">
            Edit Profile
          </h1>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
            Update your account details and contact information
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Profile updated! Returning to profile...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={fullname}
              onChange={e => setFullname(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 text-sm focus:outline-none focus:border-teal-500 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                Age
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={age}
                onChange={e => setAge(e.target.value === '' ? '' : parseInt(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 text-sm focus:outline-none focus:border-teal-500 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                Gender
              </label>
              <select
                value={gender}
                onChange={e => setGender(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 text-sm focus:outline-none focus:border-teal-500 text-gray-900 dark:text-gray-100"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+63 912 345 6789"
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 text-sm focus:outline-none focus:border-teal-500 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
              Avatar Image URL
            </label>
            <input
              type="url"
              value={avatarUrl}
              onChange={e => setAvatarUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 text-sm focus:outline-none focus:border-teal-500 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
              Bio / Personal Statement
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Share a short note about your goals or background..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 text-sm focus:outline-none focus:border-teal-500 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-md shadow-teal-500/20 flex items-center gap-2 transition-all disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
};
