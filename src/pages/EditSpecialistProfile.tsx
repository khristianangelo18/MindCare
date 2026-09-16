import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Award, MapPin, ArrowLeft, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const EditSpecialistProfile: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [fullname, setFullname] = useState(profile?.fullname || '');
  const [specialization, setSpecialization] = useState(profile?.specialization || 'Clinical Psychologist');
  const [experience, setExperience] = useState(profile?.experience || '8 Years');
  const [location, setLocation] = useState(profile?.location || 'Metro Manila');
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
      specialization,
      experience,
      location,
      bio,
      avatar_url: avatarUrl
    });

    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      setSuccess(true);
      setTimeout(() => {
        navigate('/specialist/profile');
      }, 1000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-zinc-400 hover:text-teal-600 dark:hover:text-teal-400"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Specialist Profile</span>
      </button>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm p-6 sm:p-8 space-y-6">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">
            Edit Specialist Credentials
          </h1>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
            Keep your clinical background and practice locations up to date
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
            <span>Credentials updated! Returning to profile...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
              Doctor / Practitioner Full Name
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
                Specialization
              </label>
              <input
                type="text"
                value={specialization}
                onChange={e => setSpecialization(e.target.value)}
                required
                placeholder="e.g. Clinical Psychologist"
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 text-sm focus:outline-none focus:border-teal-500 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                Years of Experience
              </label>
              <input
                type="text"
                value={experience}
                onChange={e => setExperience(e.target.value)}
                placeholder="e.g. 10 Years"
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 text-sm focus:outline-none focus:border-teal-500 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
              Practice Location / Clinic
            </label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g. Makati Medical Plaza, Metro Manila"
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 text-sm focus:outline-none focus:border-teal-500 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
              Profile Photo URL
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
              Professional Bio & Approach
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Describe your clinical focus, therapies practiced, and how you support patients..."
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
              <span>{loading ? 'Saving...' : 'Save Credentials'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
