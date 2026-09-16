import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  CheckCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Heart,
  CalendarPlus,
  Home
} from 'lucide-react';
import { PreAssessmentResult } from '../types/database';

export const PreAssessment: React.FC = () => {
  const [q1, setQ1] = useState<number | ''>('');
  const [q2, setQ2] = useState<number | ''>('');
  const [q3, setQ3] = useState<number | ''>('');
  const [result, setResult] = useState<PreAssessmentResult | null>(null);

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q1 === '' || q2 === '' || q3 === '') return;

    const score = Number(q1) + Number(q2) + Number(q3);
    let summary = 'Minimal symptoms';
    if (score <= 2) {
      summary = 'Minimal symptoms';
    } else if (score <= 5) {
      summary = 'Mild symptoms';
    } else if (score <= 7) {
      summary = 'Moderate symptoms';
    } else {
      summary = 'Severe symptoms';
    }

    setResult({
      score,
      summary,
      q1: Number(q1),
      q2: Number(q2),
      q3: Number(q3)
    });
  };

  const handleReset = () => {
    setQ1('');
    setQ2('');
    setQ3('');
    setResult(null);
  };

  const getRecommendations = (score: number) => {
    if (score <= 2) {
      return {
        title: 'Minimal Distress Detected',
        desc: 'Your responses suggest healthy emotional resilience right now. Keep nurturing your wellness habits!',
        badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
        tips: [
          'Continue your daily physical exercise and walking routine',
          'Practice 5 minutes of mindful breathing in the mornings',
          'Keep a gratitude journal to reinforce positive thoughts',
          'Stay in touch with supportive family and friends'
        ]
      };
    } else if (score <= 5) {
      return {
        title: 'Mild Symptoms Detected',
        desc: 'You may be experiencing mild day-to-day tension or emotional stress. Small lifestyle adjustments can make a big difference.',
        badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300',
        tips: [
          'Incorporate a guided relaxation or meditation session before sleep',
          'Limit screen time and caffeine intake after 6 PM',
          'Break large, stressful tasks into smaller actionable steps',
          'Talk openly with someone you trust about how you feel'
        ]
      };
    } else if (score <= 7) {
      return {
        title: 'Moderate Symptoms Detected',
        desc: 'Your responses indicate noticeable emotional distress that may be interfering with focus, mood, and daily activities.',
        badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
        tips: [
          'Consider scheduling a confidential session with a licensed specialist',
          'Establish a firm sleep schedule with 7-8 hours of uninterrupted rest',
          'Engage in box breathing: 4 counts in, 4 hold, 4 out, 4 hold',
          'Reduce isolation by connecting with close companions'
        ]
      };
    } else {
      return {
        title: 'Significant Symptoms Detected',
        desc: 'You are carrying significant distress right now. Please know that help is available and you do not need to shoulder this alone.',
        badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300',
        tips: [
          'Consult with a psychologist or medical professional as soon as possible',
          'Reach out to the 24/7 National Crisis Hotline by calling 988',
          'Lean on a designated support partner or family member today',
          'Focus purely on gentle self-care and safety'
        ]
      };
    }
  };

  const recs = result ? getRecommendations(result.score) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50/40 via-white to-gray-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 text-gray-900 dark:text-gray-100 py-10 px-4 sm:px-6 transition-colors">
      <div className="max-w-3xl mx-auto">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-zinc-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>

          <Link
            to="/login"
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
          >
            Sign In to Patient Portal &rarr;
          </Link>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-xs font-semibold mb-3">
            <Activity className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Quick Confidential Self-Screening</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Mental Wellness Check
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-zinc-400 max-w-lg mx-auto">
            Take this brief, anonymous 3-question screening to evaluate your current emotional pulse and receive personalized guidance.
          </p>
        </div>

        {!result ? (
          <div className="bg-white dark:bg-zinc-900 p-6 sm:p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-zinc-800">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Question 1 */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  <span className="text-teal-600 dark:text-teal-400 font-bold mr-1">1.</span>
                  Over the last 2 weeks, how often have you had little interest or pleasure in doing things?
                </label>
                <select
                  value={q1}
                  onChange={e => setQ1(e.target.value === '' ? '' : Number(e.target.value))}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 text-sm focus:outline-none focus:border-teal-500 text-gray-900 dark:text-gray-100"
                >
                  <option value="" disabled>Select frequency</option>
                  <option value={0}>Not at all (0 pts)</option>
                  <option value={1}>Several days (1 pt)</option>
                  <option value={2}>More than half the days (2 pts)</option>
                  <option value={3}>Nearly every day (3 pts)</option>
                </select>
              </div>

              {/* Question 2 */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  <span className="text-teal-600 dark:text-teal-400 font-bold mr-1">2.</span>
                  Over the last 2 weeks, how often have you felt down, depressed, or hopeless?
                </label>
                <select
                  value={q2}
                  onChange={e => setQ2(e.target.value === '' ? '' : Number(e.target.value))}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 text-sm focus:outline-none focus:border-teal-500 text-gray-900 dark:text-gray-100"
                >
                  <option value="" disabled>Select frequency</option>
                  <option value={0}>Not at all (0 pts)</option>
                  <option value={1}>Several days (1 pt)</option>
                  <option value={2}>More than half the days (2 pts)</option>
                  <option value={3}>Nearly every day (3 pts)</option>
                </select>
              </div>

              {/* Question 3 */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  <span className="text-teal-600 dark:text-teal-400 font-bold mr-1">3.</span>
                  Over the last 2 weeks, how often have you felt nervous, anxious, or on edge?
                </label>
                <select
                  value={q3}
                  onChange={e => setQ3(e.target.value === '' ? '' : Number(e.target.value))}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 text-sm focus:outline-none focus:border-teal-500 text-gray-900 dark:text-gray-100"
                >
                  <option value="" disabled>Select frequency</option>
                  <option value={0}>Not at all (0 pts)</option>
                  <option value={1}>Several days (1 pt)</option>
                  <option value={2}>More than half the days (2 pts)</option>
                  <option value={3}>Nearly every day (3 pts)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold text-sm shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition-all"
              >
                <span>Calculate My Results</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 p-6 sm:p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-zinc-800 space-y-6 animate-in fade-in">
            {/* Results Header */}
            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-gray-500 dark:text-zinc-400 block mb-1">
                  Overall Screening Result
                </span>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${recs?.badgeColor}`}>
                  {result.summary}
                </span>
                <h3 className="text-lg font-bold mt-2 text-gray-900 dark:text-white">
                  {recs?.title}
                </h3>
              </div>

              <div className="sm:text-right">
                <span className="text-xs text-gray-500 dark:text-zinc-400 block mb-1">
                  Total Score
                </span>
                <span className="text-3xl font-extrabold text-teal-600 dark:text-teal-400">
                  {result.score} <span className="text-sm font-normal text-gray-400">/ 9</span>
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-zinc-300 leading-relaxed">
              {recs?.desc}
            </p>

            {/* Recommendations List */}
            <div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-500" />
                <span>Recommended Next Steps:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {recs?.tips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/40 text-xs text-gray-700 dark:text-zinc-300 flex items-start gap-2.5"
                  >
                    <CheckCircle className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 flex items-center justify-center gap-2 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Screening</span>
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link
                  to="/register"
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-md shadow-teal-500/20 flex items-center justify-center gap-2 transition-all"
                >
                  <CalendarPlus className="w-4 h-4" />
                  <span>Create Account & Book Specialist</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
