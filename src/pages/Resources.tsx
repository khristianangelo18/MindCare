import React from 'react';
import {
  BookOpen,
  PhoneCall,
  ShieldAlert,
  Heart,
  ExternalLink,
  Sparkles,
  Smile,
  Compass,
  FileCheck2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Resources: React.FC = () => {
  const hotlines = [
    {
      name: 'National Center for Mental Health (NCMH) Crisis Hotline',
      region: 'Philippines (24/7)',
      contact: '1553 (Luzon toll-free) / 0917-899-8727 / 0966-351-4518',
      desc: 'Free, confidential psychological first aid and suicide intervention available 24 hours daily.'
    },
    {
      name: 'In Touch Community Services Crisis Line',
      region: 'Metro Manila / Nationwide',
      contact: '+63 2 8893 7603 / 0917-800-1123',
      desc: 'Dedicated emotional support, crisis counseling, and guidance for adults and students.'
    },
    {
      name: 'Hopeline Philippines',
      region: 'Nationwide (24/7)',
      contact: '(02) 8804-4673 / 0917-558-4673',
      desc: 'Immediate crisis response, counseling assistance, and suicide prevention hotline.'
    },
    {
      name: '988 Suicide & Crisis Lifeline',
      region: 'United States & International Standard',
      contact: 'Dial or Text 988',
      desc: 'Free, confidential suicide prevention and mental health crisis support 24/7/365.'
    }
  ];

  return (
    <div className="main-wrapper">
      <div className="max-w-5xl space-y-8 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500/15 via-teal-500/5 to-transparent p-6 sm:p-8 rounded-3xl border border-teal-500/20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-xs font-semibold mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Support Library & Emergency Directory</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
          Mental Health & Crisis Resources
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 mt-1 max-w-2xl leading-relaxed">
          Access immediate crisis lines, evidence-based coping exercises, and mental health literature verified by psychological professionals.
        </p>
      </div>

      {/* 24/7 Crisis Helplines Directory */}
      <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 p-6 sm:p-8 rounded-3xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300 flex items-center justify-center shrink-0">
            <PhoneCall className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-rose-950 dark:text-rose-200">
              Immediate 24/7 Crisis & Suicide Prevention Hotlines
            </h2>
            <p className="text-xs text-rose-700 dark:text-rose-300">
              If you or someone you know is in acute danger or distress, these lifelines provide free, confidential help immediately.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {hotlines.map((h, i) => (
            <div
              key={i}
              className="bg-white/80 dark:bg-zinc-900/90 p-4 rounded-2xl border border-rose-200/80 dark:border-rose-900/40 shadow-sm space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  {h.region}
                </span>
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">
                {h.name}
              </h3>
              <p className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400 py-0.5">
                {h.contact}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-zinc-400 leading-relaxed">
                {h.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Guided Mental Wellness Practices */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Compass className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <span>Evidence-Based Self-Regulation Tools</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm space-y-3">
            <span className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-xs">
              01
            </span>
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">
              S.T.O.P. Mindfulness Technique
            </h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
              <strong>S</strong>low down. <strong>T</strong>ake a breath. <strong>O</strong>bserve your thoughts and bodily tension without judging them. <strong>P</strong>roceed with what supports you best.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm space-y-3">
            <span className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-xs">
              02
            </span>
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">
              Progressive Muscle Relaxation (PMR)
            </h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
              Tense your shoulders for 5 seconds, notice the tension, then exhale and release completely for 15 seconds. Move progressively from toes to forehead.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm space-y-3">
            <span className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-xs">
              03
            </span>
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">
              Cognitive Thought Reframing
            </h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
              When encountering an absolute thought like "Everything is going wrong", challenge it by asking: "What is one small thing that went well or is manageable today?"
            </p>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-sm text-gray-900 dark:text-white">
            Looking for personalized clinical support?
          </h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
            You can take our full clinical self-assessment or schedule a 1-on-1 session with our accredited psychologists.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/assessment"
            className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 text-xs font-semibold hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
          >
            Clinical Assessment
          </Link>
          <Link
            to="/book-appointment"
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-md shadow-teal-500/20 transition-colors"
          >
            Book Session
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
};
