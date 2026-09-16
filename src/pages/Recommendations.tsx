import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Heart,
  CheckCircle2,
  CalendarPlus,
  ArrowRight,
  Wind,
  BookOpen,
  PhoneCall,
  Activity,
  Smile
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Assessment } from '../types/database';

export const Recommendations: React.FC = () => {
  const { user } = useAuth();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);

  // Interactive Breathing Widget State
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathText, setBreathText] = useState('Inhale (4s)');

  useEffect(() => {
    const fetchLatest = async () => {
      if (!user) return;

      if (isSupabaseConfigured) {
        try {
          const { data } = await supabase
            .from('assessments')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1);

          if (data && data.length > 0) {
            setAssessment(data[0] as Assessment);
          }
        } catch (err) {
          console.error('Error fetching recommendations:', err);
        }
      } else {
        const stored = localStorage.getItem(`mindcare-assessments-${user.id}`);
        if (stored) {
          const list = JSON.parse(stored);
          if (list.length > 0) setAssessment(list[0]);
        }
      }
      setLoading(false);
    };

    fetchLatest();
  }, [user]);

  // Guided Breathing Animation Timer
  useEffect(() => {
    if (!isBreathing) return;

    const phases = ['Inhale slowly (4s)', 'Hold gently (4s)', 'Exhale completely (4s)', 'Rest (4s)'];
    let idx = 0;
    setBreathText(phases[0]);

    const interval = setInterval(() => {
      idx = (idx + 1) % phases.length;
      setBreathText(phases[idx]);
    }, 4000);

    return () => clearInterval(interval);
  }, [isBreathing]);

  const getSeverityPlan = () => {
    const score = assessment ? assessment.score : 2;

    if (score <= 2) {
      return {
        level: 'Minimal Distress',
        headline: 'Maintain & Strengthen Your Mental Resilience',
        summary: 'Your responses reflect healthy coping and emotional equilibrium. Continue your personal rituals to stay centered.',
        color: 'emerald',
        badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
        tips: [
          'Engage in 20 minutes of daily natural sunlight exposure and walking',
          'Practice gratitude journaling: Note 3 things you felt grateful for today',
          'Maintain regular sleep hours (7.5 to 8.5 hours)',
          'Schedule casual social catch-ups with positive friends',
          'Listen to calming ambient music or natural soundscapes during work breaks'
        ]
      };
    } else if (score <= 4) {
      return {
        level: 'Moderate Symptoms',
        headline: 'Active Self-Care & Guided Stress Alleviation',
        summary: 'You are experiencing elevated emotional strain that deserves attention before fatigue or burnout builds up.',
        color: 'amber',
        badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
        tips: [
          'Schedule an exploratory consultation with a licensed MindCare psychologist',
          'Use the 5-4-3-2-1 Sensory Grounding Technique when anxious thoughts rise',
          'Implement a strict digital detox 1 hour prior to sleep',
          'Communicate boundaries clearly to prevent overextending your energy',
          'Practice box breathing twice daily to lower cortisol levels'
        ]
      };
    } else {
      return {
        level: 'Elevated Distress',
        headline: 'Compassionate Care & Professional Consultation Recommended',
        summary: 'Your symptoms indicate significant burden. Seeking specialized professional support can help lighten this load.',
        color: 'rose',
        badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300',
        tips: [
          'Connect with one of our certified specialists for personalized therapy',
          'Confide in a designated trusted loved one or support ally today',
          'Remember the 24/7 National Crisis & Suicide Lifeline: Call or Text 988',
          'Break your day into tiny, manageable 15-minute segments',
          'Focus solely on basic essentials: hydration, nourishing meals, and safe rest'
        ]
      };
    }
  };

  const plan = getSeverityPlan();

  return (
    <div className="main-wrapper">
      <div className="space-y-8 max-w-5xl pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-500/15 via-teal-500/5 to-transparent p-6 sm:p-8 rounded-3xl border border-teal-500/20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tailored Wellness Blueprint</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              {plan.headline}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              {plan.summary}
            </p>
          </div>

          <span className={`inline-block px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 ${plan.badge}`}>
            {plan.level} ({assessment ? `${assessment.score} / 6` : 'Screening'})
          </span>
        </div>
      </div>

      {/* Main Grid: Interactive Grounding Tool & Curated Action Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Guided Box Breathing Widget */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col items-center text-center justify-between">
          <div className="w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <Wind className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Box Breathing</span>
              </h3>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                Calming Tool
              </span>
            </div>

            <p className="text-xs text-gray-500 dark:text-zinc-400 mb-6">
              Regulate your autonomic nervous system with guided rhythmic breathing.
            </p>

            <div className="relative w-44 h-44 mx-auto flex items-center justify-center my-4">
              <div
                className={`absolute inset-0 rounded-full bg-teal-500/20 border-2 border-teal-500 transition-all duration-1000 ${
                  isBreathing ? 'animate-ping opacity-30' : 'opacity-20'
                }`}
              ></div>
              <div
                className={`w-36 h-36 rounded-full bg-gradient-to-tr from-teal-500 to-teal-400 text-white shadow-xl shadow-teal-500/30 flex flex-col items-center justify-center p-3 transition-transform duration-1000 ${
                  isBreathing ? 'scale-105' : 'scale-95'
                }`}
              >
                <Wind className="w-7 h-7 mb-1" />
                <span className="text-xs font-extrabold leading-tight text-center">
                  {isBreathing ? breathText : 'Press Start'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsBreathing(!isBreathing)}
            className="w-full mt-4 py-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-700 dark:text-teal-300 font-semibold text-xs transition-colors"
          >
            {isBreathing ? 'Stop Exercise' : 'Begin 4-4-4 Breathing'}
          </button>
        </div>

        {/* Action Steps Column */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h2 className="font-bold text-base text-gray-900 dark:text-white">
                Personalized Care Recommendations
              </h2>
            </div>
          </div>

          <div className="space-y-3">
            {plan.tips.map((tip, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-700/60 flex items-start gap-3.5 hover:bg-teal-50/40 dark:hover:bg-teal-950/20 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-zinc-200 leading-relaxed">
                  {tip}
                </p>
              </div>
            ))}
          </div>

          {/* Booking CTA Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-50 to-teal-100/50 dark:from-teal-950/40 dark:to-teal-900/20 border border-teal-200 dark:border-teal-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-sm text-teal-900 dark:text-teal-200">
                Ready to speak with a certified specialist?
              </h4>
              <p className="text-xs text-teal-700 dark:text-teal-300 mt-0.5">
                Private virtual and in-person sessions tailored to your individual goals.
              </p>
            </div>

            <Link
              to="/book-appointment"
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-md shadow-teal-500/20 flex items-center gap-2 transition-all shrink-0"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>Book Specialist</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Grounding Technique: 5-4-3-2-1 */}
      <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm">
        <h3 className="font-bold text-base text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500" />
          <span>5-4-3-2-1 Grounding Method for Anxiety</span>
        </h3>
        <p className="text-xs text-gray-500 dark:text-zinc-400 mb-6">
          When feeling disconnected or overwhelmed, use your five senses to anchor back to the present room:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
          <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-700/60">
            <span className="text-xl font-black text-teal-600 dark:text-teal-400 block mb-1">5</span>
            <span className="font-semibold text-xs block">Things to SEE</span>
            <span className="text-[10px] text-gray-400 dark:text-zinc-500 mt-1 block">Notice colors, shapes & light</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-700/60">
            <span className="text-xl font-black text-teal-600 dark:text-teal-400 block mb-1">4</span>
            <span className="font-semibold text-xs block">Things to TOUCH</span>
            <span className="text-[10px] text-gray-400 dark:text-zinc-500 mt-1 block">Feel fabric, texture & desk</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-700/60">
            <span className="text-xl font-black text-teal-600 dark:text-teal-400 block mb-1">3</span>
            <span className="font-semibold text-xs block">Things to HEAR</span>
            <span className="text-[10px] text-gray-400 dark:text-zinc-500 mt-1 block">Listen to distant sounds</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-700/60">
            <span className="text-xl font-black text-teal-600 dark:text-teal-400 block mb-1">2</span>
            <span className="font-semibold text-xs block">Things to SMELL</span>
            <span className="text-[10px] text-gray-400 dark:text-zinc-500 mt-1 block">Breathe fresh air or tea</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-700/60">
            <span className="text-xl font-black text-teal-600 dark:text-teal-400 block mb-1">1</span>
            <span className="font-semibold text-xs block">Thing to TASTE</span>
            <span className="text-[10px] text-gray-400 dark:text-zinc-500 mt-1 block">Sip of cool water</span>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};
