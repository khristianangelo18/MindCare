import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Calendar,
  Phone,
  Edit,
  Shield,
  Heart,
  FileText,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Profile: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="main-wrapper">
      <div className="max-w-4xl space-y-6 pb-16">
      {/* Header Profile Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <img
            src={profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
            alt={profile?.fullname || 'User'}
            className="w-24 h-24 rounded-3xl object-cover border-4 border-teal-500/20 shadow-md"
          />
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                {profile?.fullname || 'Patient'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-[10px] font-bold uppercase">
                {profile?.role || 'Patient'}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1 flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>{profile?.email}</span>
            </p>
            <p className="text-xs text-gray-600 dark:text-zinc-300 mt-3 max-w-md">
              {profile?.bio || 'Taking active steps toward balanced mental wellness and personal growth with MindCare.'}
            </p>
          </div>
        </div>

        <Link
          to="/profile/edit"
          className="px-4 py-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900 text-teal-700 dark:text-teal-300 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
        >
          <Edit className="w-3.5 h-3.5" />
          <span>Edit Profile</span>
        </Link>
      </div>

      {/* Demographics & Clinical Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-zinc-800 pb-3">
            <User className="w-4 h-4 text-teal-500" />
            <span>Personal Information</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-gray-50 dark:border-zinc-800/60">
              <span className="text-gray-400 dark:text-zinc-500">Gender</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {profile?.gender || 'Not specified'}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-50 dark:border-zinc-800/60">
              <span className="text-gray-400 dark:text-zinc-500">Age</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {profile?.age ? `${profile.age} years old` : 'Not specified'}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-50 dark:border-zinc-800/60">
              <span className="text-gray-400 dark:text-zinc-500">Phone Contact</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {profile?.phone || 'Not provided'}
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-gray-400 dark:text-zinc-500">Member Since</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {new Date(profile?.created_at || Date.now()).toLocaleDateString([], {
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-zinc-800 pb-3">
            <Shield className="w-4 h-4 text-teal-500" />
            <span>Confidentiality & Privacy</span>
          </h2>

          <p className="text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">
            Your clinical answers, appointments, and personal health metrics are securely encrypted. Only you and your chosen verified specialists have visibility over your records.
          </p>

          <div className="pt-2">
            <Link
              to="/assessment/history"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>View All Past Clinical Assessment Records</span>
            </Link>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};
