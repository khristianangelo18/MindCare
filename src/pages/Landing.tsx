import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HeartHandshake,
  Shield,
  Calendar,
  Sparkles,
  ArrowRight,
  Bot,
  Activity,
  PhoneCall,
  UserCheck,
  CheckCircle2,
  Lock,
  ClipboardCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export const Landing: React.FC = () => {
  const { user, profile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50/40 via-white to-gray-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 text-gray-900 dark:text-gray-100 transition-colors">
      {/* Top Navigation */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <img
            src="/images/Mindcare.png"
            alt="MindCare"
            className="h-10 sm:h-12 w-auto object-contain"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <span className="font-extrabold text-xl tracking-wider text-teal-600 dark:text-teal-400">
            MINDCARE
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Moon className="w-5 h-5 text-teal-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
          </button>

          {user ? (
            <Link
              to={profile?.role === 'Specialist' ? '/specialist/dashboard' : '/dashboard'}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-teal-500/20 transition-all"
            >
              Go to Dashboard &rarr;
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-zinc-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-4 sm:px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-teal-500/20 transition-all hover:scale-105"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/70 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-xs font-semibold mb-6 border border-teal-200 dark:border-teal-800">
          <Sparkles className="w-4 h-4 text-teal-500" />
          <span>Compassionate Care, Verified Specialists & AI Support</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight">
          Your Safe Space for{' '}
          <span className="bg-gradient-to-r from-teal-500 to-teal-700 bg-clip-text text-transparent">
            Mental Healing & Wellness
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-gray-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          MindCare provides confidential psychological self-assessments, direct booking with certified mental health specialists, and 24/7 empathetic AI support.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold text-sm shadow-lg shadow-teal-500/30 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
          >
            <span>Begin Your Journey</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/pre-assessment"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-800 dark:text-gray-200 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-zinc-700/60 flex items-center justify-center gap-2 transition-all"
          >
            <Activity className="w-4 h-4 text-teal-500" />
            <span>Take Quick Free Screening</span>
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950 flex items-center justify-center text-teal-600 dark:text-teal-400 mb-5">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Clinical Assessments</h3>
            <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
              Complete self-awareness and emotional screenings with instant score interpretation, PDF reports, and personalized recovery roadmaps.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950 flex items-center justify-center text-teal-600 dark:text-teal-400 mb-5">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Specialist Bookings</h3>
            <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
              Browse licensed psychologists and counselors, schedule private consultations, manage appointment statuses, and reschedule anytime.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950 flex items-center justify-center text-teal-600 dark:text-teal-400 mb-5">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Beyond AI Companion</h3>
            <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
              An empathetic 24/7 AI companion ready to listen, offer emotional validation, guide you to services, and detect crisis situations instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Emergency Helpline Banner */}
      <section className="bg-rose-50 dark:bg-rose-950/30 border-y border-rose-200 dark:border-rose-900/40 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300 flex items-center justify-center shrink-0">
              <PhoneCall className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-rose-900 dark:text-rose-200 text-base">
                In Immediate Crisis or Need Urgent Support?
              </h4>
              <p className="text-xs text-rose-700 dark:text-rose-300">
                You are not alone. Free, confidential support is available 24 hours a day, 7 days a week.
              </p>
            </div>
          </div>
          <a
            href="tel:988"
            className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-600/20 transition-all shrink-0"
          >
            Call or Text 988
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400 dark:text-zinc-500">
        <p>&copy; {new Date().getFullYear()} MindCare Platform. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link to="/faq" className="hover:text-teal-600 dark:hover:text-teal-400">
            FAQ
          </Link>
          <Link to="/resources" className="hover:text-teal-600 dark:hover:text-teal-400">
            Resources
          </Link>
          <Link to="/admin/login" className="hover:text-teal-600 dark:hover:text-teal-400">
            Specialist Portal
          </Link>
        </div>
      </footer>
    </div>
  );
};
