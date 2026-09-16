import React from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  Award,
  MapPin,
  Edit,
  ShieldCheck,
  Calendar,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SpecialistProfile: React.FC = () => {
  const { profile } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header Profile Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <img
            src={profile?.avatar_url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'}
            alt={profile?.fullname || 'Specialist'}
            className="w-24 h-24 rounded-3xl object-cover border-4 border-teal-500/20 shadow-md"
          />
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                {profile?.fullname || 'Specialist'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-[10px] font-bold uppercase">
                {profile?.specialization || 'Clinical Specialist'}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1 flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>{profile?.email}</span>
            </p>
            <p className="text-xs text-gray-600 dark:text-zinc-300 mt-3 max-w-md">
              {profile?.bio || 'Certified mental health practitioner providing evidence-based psychotherapy, psychological assessments, and personalized compassionate guidance.'}
            </p>
          </div>
        </div>

        <Link
          to="/specialist/edit-profile"
          className="px-4 py-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900 text-teal-700 dark:text-teal-300 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
        >
          <Edit className="w-3.5 h-3.5" />
          <span>Edit Credentials</span>
        </Link>
      </div>

      {/* Practitioner Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-zinc-800 pb-3">
            <Award className="w-4 h-4 text-teal-500" />
            <span>Clinical Credentials</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-gray-50 dark:border-zinc-800/60">
              <span className="text-gray-400 dark:text-zinc-500">Specialization</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {profile?.specialization || 'Psychologist'}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-50 dark:border-zinc-800/60">
              <span className="text-gray-400 dark:text-zinc-500">Clinical Experience</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {profile?.experience || '8 Years'}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-50 dark:border-zinc-800/60">
              <span className="text-gray-400 dark:text-zinc-500">Clinic Location</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {profile?.location || 'Metro Manila'}
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-gray-400 dark:text-zinc-500">Practitioner Status</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Practitioner</span>
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-zinc-800 pb-3">
            <Clock className="w-4 h-4 text-teal-500" />
            <span>Consultation Hours</span>
          </h2>

          <div className="space-y-2 text-xs text-gray-600 dark:text-zinc-300">
            <p className="flex justify-between py-1">
              <span>Monday – Friday:</span>
              <span className="font-semibold text-gray-900 dark:text-white">09:00 AM – 04:00 PM</span>
            </p>
            <p className="flex justify-between py-1">
              <span>Saturday:</span>
              <span className="font-semibold text-gray-900 dark:text-white">By Special Request</span>
            </p>
            <p className="flex justify-between py-1">
              <span>Sunday:</span>
              <span className="font-semibold text-rose-500">Closed</span>
            </p>
          </div>

          <div className="pt-3 border-t border-gray-100 dark:border-zinc-800">
            <Link
              to="/specialist/dashboard"
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Go to Consultation Schedule Queue &rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
