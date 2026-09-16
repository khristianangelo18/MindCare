import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, MessageCircle, PhoneCall } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    category: 'General & Platform',
    question: 'What is MindCare?',
    answer: 'MindCare is an integrated mental wellness and psychological care platform. We connect individuals with certified mental health specialists, provide evidence-informed clinical self-assessments, and offer an empathetic 24/7 AI companion called Beyond.'
  },
  {
    category: 'Assessments',
    question: 'Are my mental health assessment results confidential?',
    answer: 'Yes, completely. Your responses and screening results are protected under stringent Row Level Security (RLS) policies and encryption. They are strictly private to your personal profile and any specialist you choose to consult with.'
  },
  {
    category: 'Assessments',
    question: 'How are clinical assessment scores interpreted?',
    answer: 'Our assessments evaluate emotional states, situational orientation, short-term cognitive memory, and diagnostic symptom frequencies. Scores from 0 to 2 indicate minimal distress, 3 to 4 represent moderate symptoms that benefit from guided coping, and 5 to 6 suggest elevated distress where specialist guidance is recommended.'
  },
  {
    category: 'Consultations',
    question: 'How do I book an appointment with a specialist?',
    answer: 'Go to the "Book Appointment" tab in your sidebar. Browse our directory of psychologists and counselors, view their credentials and clinic locations, select your preferred date, pick an open 1-hour time slot, and click "Confirm Appointment".'
  },
  {
    category: 'Consultations',
    question: 'Can I reschedule or cancel my appointment?',
    answer: 'Yes. In the "My Appointments" tab, any Pending or Confirmed appointment has active "Reschedule" and "Cancel" buttons. When cancelling, you can optionally provide a reason so your specialist is informed.'
  },
  {
    category: 'AI Companion',
    question: 'How does the Beyond AI Companion work?',
    answer: 'Beyond is an empathetic AI mental health companion powered by Google Gemini. Beyond provides immediate emotional validation, active listening, grounding tips, and platform assistance. If Beyond senses any indication of self-harm or crisis, it immediately surfaces emergency lifeline resources.'
  },
  {
    category: 'Emergency Support',
    question: 'What should I do if I or a loved one is in immediate crisis?',
    answer: 'If you are facing severe distress or thinking of self-harm, please reach out immediately to the Suicide & Crisis Lifeline by dialing or texting 988. Free, confidential, and professional support is available 24/7. You can also visit your local hospital emergency room.'
  }
];

export const FAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'General & Platform', 'Assessments', 'Consultations', 'AI Companion', 'Emergency Support'];

  const filtered = activeCategory === 'All' ? FAQS : FAQS.filter(f => f.category === activeCategory);

  return (
    <div className="main-wrapper">
      <div className="max-w-4xl space-y-8 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500/15 via-teal-500/5 to-transparent p-6 sm:p-8 rounded-3xl border border-teal-500/20 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-xs font-semibold mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Knowledge Base & Support</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 mt-1 max-w-xl">
          Everything you need to know about MindCare clinical screenings, consultations, privacy, and our AI companion.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeCategory === cat
                ? 'bg-teal-600 text-white shadow-sm shadow-teal-500/20'
                : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 border border-gray-100 dark:border-zinc-800 hover:border-teal-500/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filtered.map((faq, idx) => {
          const isOpen = openIdx === idx;

          return (
            <div
              key={idx}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-gray-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              >
                <span>{faq.question}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-teal-500 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-gray-600 dark:text-zinc-300 leading-relaxed border-t border-gray-50 dark:border-zinc-800/60 animate-in fade-in">
                  <p>{faq.answer}</p>
                  <span className="inline-block mt-3 text-[10px] font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                    Category: {faq.category}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Help Banner */}
      <div className="p-6 rounded-3xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-sm text-teal-900 dark:text-teal-200">
            Still have questions or need guidance?
          </h4>
          <p className="text-xs text-teal-700 dark:text-teal-300 mt-0.5">
            Beyond AI is available 24/7 via the floating chat bubble on the bottom right.
          </p>
        </div>
        <Link
          to="/book-appointment"
          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-md shadow-teal-500/20 shrink-0"
        >
          Speak with a Specialist
        </Link>
      </div>
      </div>
    </div>
  );
};
