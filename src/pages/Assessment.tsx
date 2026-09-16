import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardCheck,
  Send,
  AlertCircle,
  HelpCircle,
  Brain,
  Smile,
  Eye,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const Assessment: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form Fields matching assessment.php
  const [formData, setFormData] = useState({
    // Section 1: Orientation
    orientation_0: profile?.fullname || '',
    orientation_1: '',
    orientation_2: '',
    orientation_3: new Date().toISOString().split('T')[0],
    orientation_4: '',

    // Section 2: Emotional Well-Being
    emotions_0: '',
    emotions_1: '',
    emotions_2: '',
    emotions_3: '',
    emotions_4: '',

    // Section 3: Memory
    memory_initial: '',
    memory_recall: '',

    // Section 4: Thoughts
    thoughts_0: '',
    thoughts_1: '',
    thoughts_2: '',
    thoughts_3: '',

    // Section 5: Decisions
    decisions_0: '',
    decisions_1: '',
    decisions_2: '',

    // Section 6: Core
    q1: 0,
    q2: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'q1' || name === 'q2' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const score = Number(formData.q1) + Number(formData.q2);
    let summary = 'Mild symptoms';
    if (score <= 2) {
      summary = 'Mild symptoms';
    } else if (score <= 4) {
      summary = 'Moderate symptoms';
    } else {
      summary = 'Severe symptoms';
    }

    const payload = {
      user_id: user?.id,
      score,
      summary,
      ...formData,
      created_at: new Date().toISOString()
    };

    if (user && isSupabaseConfigured) {
      try {
        const { error: insertErr } = await supabase.from('assessments').insert(payload);
        if (insertErr) {
          console.error('Supabase assessment insert failed:', insertErr);
        }

        // Insert notification
        await supabase.from('notifications').insert({
          user_id: user.id,
          message: 'Your new mental health assessment has been submitted.',
          is_read: false
        });
      } catch (err: any) {
        console.error('Error recording assessment:', err);
      }
    } else if (user) {
      // Local demo fallback
      const key = `mindcare-assessments-${user.id}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      const savedItem = { id: Date.now(), ...payload };
      localStorage.setItem(key, JSON.stringify([savedItem, ...existing]));
    }

    // Fire Confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (_) {}

    setSubmitting(false);
    navigate('/recommendations');
  };

  return (
    <div className="main-wrapper">
      <div className="max-w-4xl space-y-8 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500/15 via-teal-500/5 to-transparent p-6 sm:p-8 rounded-3xl border border-teal-500/20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-xs font-semibold mb-3">
          <ClipboardCheck className="w-3.5 h-3.5" />
          <span>Clinical Screening & Self-Awareness</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
          Mental Health & Self-Awareness Assessment
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 mt-2 max-w-2xl leading-relaxed">
          Hello <span className="font-semibold text-teal-600 dark:text-teal-400">{profile?.fullname || 'there'}</span>!
          Please take a quiet moment to respond openly and honestly. Your answers are confidential and help craft your tailored care recommendations.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Orientation and Awareness */}
        <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-zinc-800">
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Orientation & Situational Awareness
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Grounding and current environment check
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                1. Your Full Name
              </label>
              <input
                type="text"
                name="orientation_0"
                value={formData.orientation_0}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 text-sm focus:outline-none focus:border-teal-500 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                2. Where are you right now?
              </label>
              <input
                type="text"
                name="orientation_1"
                placeholder="e.g. Home, Office, Quiet Room"
                value={formData.orientation_1}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 text-sm focus:outline-none focus:border-teal-500 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                3. What approximate time is it?
              </label>
              <input
                type="text"
                name="orientation_2"
                placeholder="e.g. 10:30 AM"
                value={formData.orientation_2}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 text-sm focus:outline-none focus:border-teal-500 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                4. Today's Date
              </label>
              <input
                type="date"
                name="orientation_3"
                value={formData.orientation_3}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 text-sm focus:outline-none focus:border-teal-500 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
              5. What brought you here today? (Primary concern or goal)
            </label>
            <input
              type="text"
              name="orientation_4"
              placeholder="e.g. Managing work stress, improving emotional balance"
              value={formData.orientation_4}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 text-sm focus:outline-none focus:border-teal-500 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        {/* Section 2: Emotional Well-Being */}
        <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-zinc-800">
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Emotional Well-Being
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Current feelings, triggers, and support networks
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                1. Describe your mood right now
              </label>
              <input
                type="text"
                name="emotions_0"
                placeholder="e.g. Anxious, numb, calm, overwhelmed"
                value={formData.emotions_0}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 text-sm focus:outline-none focus:border-teal-500 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                2. What were your most frequent emotions throughout this past week?
              </label>
              <input
                type="text"
                name="emotions_1"
                placeholder="e.g. Frustration, fatigue, moments of joy, dread"
                value={formData.emotions_1}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 text-sm focus:outline-none focus:border-teal-500 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                3. Is there something specific worrying or upsetting you recently?
              </label>
              <input
                type="text"
                name="emotions_2"
                placeholder="Share whatever feels comfortable"
                value={formData.emotions_2}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 text-sm focus:outline-none focus:border-teal-500 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                  4. What situations make you feel calm or anxious?
                </label>
                <input
                  type="text"
                  name="emotions_3"
                  placeholder="e.g. Crowds make me tense, nature calms me"
                  value={formData.emotions_3}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 text-sm focus:outline-none focus:border-teal-500 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                  5. Do you feel supported by family, friends, or peers?
                </label>
                <input
                  type="text"
                  name="emotions_4"
                  placeholder="Describe your current support circle"
                  value={formData.emotions_4}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 text-sm focus:outline-none focus:border-teal-500 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Memory & Concentration */}
        <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-zinc-800">
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Memory & Concentration Exercise
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Short-term cognitive recall test
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                1. Please type these three words: <strong className="text-teal-600 dark:text-teal-400">Leaf – Phone – Chair</strong>
              </label>
              <input
                type="text"
                name="memory_initial"
                placeholder="Type: Leaf, Phone, Chair"
                value={formData.memory_initial}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 text-sm focus:outline-none focus:border-teal-500 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                2. Later in this assessment, can you recall those three words?
              </label>
              <input
                type="text"
                name="memory_recall"
                placeholder="Type the words you remember"
                value={formData.memory_recall}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 text-sm focus:outline-none focus:border-teal-500 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Thought and Perception */}
        <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-zinc-800">
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-sm">
              4
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Thought & Perception
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Cognitive flow, paranoia, and dissociation indicators
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                1. Have you experienced disturbing, racing, or hard-to-control thoughts?
              </label>
              <input
                type="text"
                name="thoughts_0"
                placeholder="Describe briefly (or 'None')"
                value={formData.thoughts_0}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 text-sm focus:outline-none focus:border-teal-500 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                2. Do you frequently feel that others are judging, talking about, or against you?
              </label>
              <input
                type="text"
                name="thoughts_1"
                placeholder="Describe your experience"
                value={formData.thoughts_1}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 text-sm focus:outline-none focus:border-teal-500 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                3. Have you seen, heard, or felt things that others around you cannot see or hear?
              </label>
              <input
                type="text"
                name="thoughts_2"
                placeholder="Describe if applicable (or 'No')"
                value={formData.thoughts_2}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 text-sm focus:outline-none focus:border-teal-500 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                4. Do you experience feelings of disconnect from your body or surroundings (derealization)?
              </label>
              <input
                type="text"
                name="thoughts_3"
                placeholder="Describe if applicable (or 'Rarely/Never')"
                value={formData.thoughts_3}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 text-sm focus:outline-none focus:border-teal-500 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Decision-Making and Insight */}
        <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-zinc-800">
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-sm">
              5
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Decision-Making & Personal Insight
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Empathy, problem solving, and readiness for growth
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                1. How would you respond if a close friend were crying and asking for help?
              </label>
              <input
                type="text"
                name="decisions_0"
                placeholder="e.g. Listen without judgment, offer comfort, stay present"
                value={formData.decisions_0}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 text-sm focus:outline-none focus:border-teal-500 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                2. What does prioritizing your mental health mean to you right now?
              </label>
              <input
                type="text"
                name="decisions_1"
                placeholder="Share your personal perspective"
                value={formData.decisions_1}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 text-sm focus:outline-none focus:border-teal-500 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                3. How ready do you feel to embrace healthy changes or speak to a counselor?
              </label>
              <input
                type="text"
                name="decisions_2"
                placeholder="e.g. Fully ready, hesitant but willing, exploring"
                value={formData.decisions_2}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 text-sm focus:outline-none focus:border-teal-500 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Section 6: Core Diagnostic Screening */}
        <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-zinc-800">
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-sm">
              6
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Core Clinical Scoring
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Frequency index for anxiety and depressive indicators
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                1. How often have you felt nervous, anxious, or irritable this week?
              </label>
              <select
                name="q1"
                value={formData.q1}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 text-sm focus:outline-none focus:border-teal-500 text-gray-900 dark:text-gray-100"
              >
                <option value={0}>Not at all (0 pts)</option>
                <option value={1}>Several days (1 pt)</option>
                <option value={2}>More than half the days (2 pts)</option>
                <option value={3}>Nearly every day (3 pts)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                2. How often have you felt down, depressed, or lacking energy this week?
              </label>
              <select
                name="q2"
                value={formData.q2}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 text-sm focus:outline-none focus:border-teal-500 text-gray-900 dark:text-gray-100"
              >
                <option value={0}>Not at all (0 pts)</option>
                <option value={1}>Several days (1 pt)</option>
                <option value={2}>More than half the days (2 pts)</option>
                <option value={3}>Nearly every day (3 pts)</option>
              </select>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 dark:border-zinc-800 text-center">
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold text-sm shadow-xl shadow-teal-500/25 flex items-center justify-center gap-2 mx-auto transition-all hover:scale-105 disabled:opacity-60"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Assessment & Generate Report</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
      </div>
    </div>
  );
};
