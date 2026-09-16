import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  History,
  FileText,
  Calendar,
  ArrowRight,
  ClipboardCheck,
  TrendingUp,
  Download
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Assessment } from '../types/database';

export const AssessmentHistory: React.FC = () => {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;

      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase
            .from('assessments')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (data && !error) {
            setAssessments(data as Assessment[]);
          }
        } catch (err) {
          console.error('Failed to load assessment history:', err);
        }
      } else {
        const stored = localStorage.getItem(`mindcare-assessments-${user.id}`);
        if (stored) {
          setAssessments(JSON.parse(stored));
        }
      }

      setLoading(false);
    };

    fetchHistory();
  }, [user]);

  return (
    <div className="main-wrapper">
      <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2.5">
            <History className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            <span>Assessment History</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-1">
            Review your past psychological screenings, score progressions, and clinical reports.
          </p>
        </div>

        <Link
          to="/assessment"
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-md shadow-teal-500/20 flex items-center justify-center gap-2 transition-all shrink-0"
        >
          <ClipboardCheck className="w-4 h-4" />
          <span>Take New Assessment</span>
        </Link>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-gray-400">Loading history records...</p>
        </div>
      ) : assessments.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 p-12 rounded-3xl border border-gray-100 dark:border-zinc-800 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 mx-auto flex items-center justify-center">
            <FileText className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            No Past Assessments Found
          </h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400 max-w-sm mx-auto">
            You have not recorded any clinical screenings yet. Taking an assessment provides valuable insights into your mental state.
          </p>
          <Link
            to="/assessment"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 transition-colors"
          >
            <span>Begin Your First Screening</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {assessments.map((a, idx) => (
            <div
              key={a.id || idx}
              className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-teal-500/30 hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                      Clinical Assessment Report
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        a.score <= 2
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : a.score <= 4
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      }`}
                    >
                      {a.summary}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 flex items-center gap-2 mt-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(a.created_at || Date.now()).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100 dark:border-zinc-800">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-gray-400 dark:text-zinc-500 block uppercase tracking-wider font-semibold">
                    Score
                  </span>
                  <span className="text-base font-extrabold text-gray-900 dark:text-white">
                    {a.score} / 6
                  </span>
                </div>

                <Link
                  to={`/assessment/report/${a.id || idx}`}
                  state={{ assessment: a }}
                  className="px-3.5 py-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900 text-teal-700 dark:text-teal-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Report</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};
