import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  Download,
  ArrowLeft,
  Calendar,
  User,
  CheckCircle2,
  AlertCircle,
  Share2
} from 'lucide-react';
import jsPDF from 'jspdf';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Assessment } from '../types/database';

export const AssessmentReport: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [assessment, setAssessment] = useState<Assessment | null>(
    (location.state as any)?.assessment || null
  );
  const [loading, setLoading] = useState(!assessment);

  useEffect(() => {
    if (assessment) return;

    const fetchAssessment = async () => {
      if (isSupabaseConfigured && id && !id.startsWith('demo')) {
        try {
          const { data, error } = await supabase
            .from('assessments')
            .select('*')
            .eq('id', id)
            .single();

          if (data && !error) {
            setAssessment(data as Assessment);
          }
        } catch (err) {
          console.error('Error fetching report:', err);
        }
      } else if (user) {
        const stored = localStorage.getItem(`mindcare-assessments-${user.id}`);
        if (stored) {
          const list: Assessment[] = JSON.parse(stored);
          const found = list.find((a: any) => String(a.id) === String(id)) || list[0];
          setAssessment(found || null);
        }
      }
      setLoading(false);
    };

    fetchAssessment();
  }, [id, user]);

  const exportPDF = () => {
    if (!assessment) return;

    const doc = new jsPDF();
    const primaryColor = '#1aa592';
    const textColor = '#333333';

    // Header Banner
    doc.setFillColor(90, 208, 190);
    doc.rect(0, 0, 210, 30, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('MINDCARE', 15, 18);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Mental Health & Psychological Assessment Report', 15, 25);

    // Patient Information
    doc.setTextColor(textColor);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Patient Demographics', 15, 42);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const patientName = assessment.orientation_0 || profile?.fullname || 'Patient';
    const patientEmail = profile?.email || 'N/A';
    const patientAge = profile?.age ? `${profile.age} years old` : 'Not stated';
    const patientGender = profile?.gender || 'Not stated';
    const reportDate = new Date(assessment.created_at || Date.now()).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    doc.text(`Name: ${patientName}`, 15, 50);
    doc.text(`Email: ${patientEmail}`, 15, 56);
    doc.text(`Age: ${patientAge}`, 110, 50);
    doc.text(`Gender: ${patientGender}`, 110, 56);
    doc.text(`Evaluation Date: ${reportDate}`, 15, 64);

    // Clinical Summary Box
    doc.setDrawColor(90, 208, 190);
    doc.setFillColor(248, 250, 250);
    doc.roundedRect(15, 72, 180, 24, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(`Symptom Index Score: ${assessment.score} / 6`, 20, 81);
    doc.text(`Classification: ${assessment.summary}`, 20, 89);

    // Findings Sections
    let currentY = 108;
    const addSection = (title: string, items: { q: string; a?: string }[]) => {
      if (currentY > 260) {
        doc.addPage();
        currentY = 20;
      }
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(26, 165, 146);
      doc.text(title, 15, currentY);
      currentY += 6;

      doc.setFontSize(9);
      doc.setTextColor(textColor);
      items.forEach(item => {
        if (!item.a) return;
        if (currentY > 270) {
          doc.addPage();
          currentY = 20;
        }
        doc.setFont('helvetica', 'bold');
        doc.text(`• ${item.q}:`, 18, currentY);
        doc.setFont('helvetica', 'normal');
        doc.text(item.a || 'None recorded', 80, currentY);
        currentY += 5.5;
      });
      currentY += 4;
    };

    addSection('1. Orientation & Awareness', [
      { q: 'Current Location', a: assessment.orientation_1 },
      { q: 'Approximate Time', a: assessment.orientation_2 },
      { q: 'Reason for Visit', a: assessment.orientation_4 }
    ]);

    addSection('2. Emotional State', [
      { q: 'Current Mood', a: assessment.emotions_0 },
      { q: 'Recent Dominant Emotions', a: assessment.emotions_1 },
      { q: 'Primary Stressor/Worry', a: assessment.emotions_2 },
      { q: 'Support System Availability', a: assessment.emotions_4 }
    ]);

    addSection('3. Cognitive & Thought Patterns', [
      { q: 'Immediate Recall Words', a: assessment.memory_initial },
      { q: 'Delayed Recall Words', a: assessment.memory_recall },
      { q: 'Disturbing/Intrusive Thoughts', a: assessment.thoughts_0 },
      { q: 'Paranoia / Feeling Watched', a: assessment.thoughts_1 },
      { q: 'Sensory Dissociation / Visions', a: assessment.thoughts_2 }
    ]);

    addSection('4. Insight & Decision Making', [
      { q: 'Empathy & Crisis Reaction', a: assessment.decisions_0 },
      { q: 'Readiness for Change', a: assessment.decisions_2 }
    ]);

    // Footer Disclaimer
    doc.setFontSize(8);
    doc.setTextColor(130, 130, 130);
    doc.text(
      'Disclaimer: This report is generated by MindCare for clinical guidance and self-awareness. Confidential.',
      15,
      285
    );

    doc.save(`MindCare_Assessment_Report_${reportDate.replace(/ /g, '_')}.pdf`);
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="w-8 h-8 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-xs text-gray-500">Loading report details...</p>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="text-center py-16">
        <h3 className="text-base font-bold mb-2">Report Not Found</h3>
        <button
          onClick={() => navigate('/assessment/history')}
          className="text-xs font-semibold text-teal-600 hover:underline"
        >
          Return to History
        </button>
      </div>
    );
  }

  return (
    <div className="main-wrapper">
      <div className="max-w-4xl space-y-6 pb-16">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-zinc-400 hover:text-teal-600 dark:hover:text-teal-400"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Assessments</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={exportPDF}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-md shadow-teal-500/20 flex items-center gap-2 transition-all hover:scale-105"
          >
            <Download className="w-4 h-4" />
            <span>Download Clinical PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Canvas */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-xl overflow-hidden">
        {/* Banner */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-700 text-white p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-teal-100 block">
                MindCare Platform
              </span>
              <h1 className="text-xl sm:text-2xl font-black mt-1">
                Mental Health Assessment Report
              </h1>
            </div>
            <FileText className="w-10 h-10 text-white/30" />
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Patient Overview Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-700/60 text-xs">
            <div>
              <span className="text-gray-400 dark:text-zinc-500 block">Patient Name</span>
              <span className="font-bold text-gray-900 dark:text-white text-sm">
                {assessment.orientation_0 || profile?.fullname || 'Patient'}
              </span>
            </div>
            <div>
              <span className="text-gray-400 dark:text-zinc-500 block">Assessment Date</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {new Date(assessment.created_at || Date.now()).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="text-gray-400 dark:text-zinc-500 block">Status Result</span>
              <span className="font-bold text-teal-600 dark:text-teal-400">
                {assessment.summary}
              </span>
            </div>
            <div>
              <span className="text-gray-400 dark:text-zinc-500 block">Severity Score</span>
              <span className="font-extrabold text-gray-900 dark:text-white text-base">
                {assessment.score} / 6
              </span>
            </div>
          </div>

          {/* Detailed Responses Sections */}
          <div className="space-y-6 text-xs">
            {/* Section 1 */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm text-teal-700 dark:text-teal-400 border-b border-gray-100 dark:border-zinc-800 pb-1">
                1. Orientation & Awareness
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <p><strong className="text-gray-500 dark:text-zinc-400">Location:</strong> {assessment.orientation_1 || 'Not specified'}</p>
                <p><strong className="text-gray-500 dark:text-zinc-400">Time of day:</strong> {assessment.orientation_2 || 'Not specified'}</p>
                <p className="sm:col-span-2"><strong className="text-gray-500 dark:text-zinc-400">Reason for visit:</strong> {assessment.orientation_4 || 'Not specified'}</p>
              </div>
            </div>

            {/* Section 2 */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm text-teal-700 dark:text-teal-400 border-b border-gray-100 dark:border-zinc-800 pb-1">
                2. Emotional Well-Being
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <p><strong className="text-gray-500 dark:text-zinc-400">Present Mood:</strong> {assessment.emotions_0 || 'Not specified'}</p>
                <p><strong className="text-gray-500 dark:text-zinc-400">Past Week Emotions:</strong> {assessment.emotions_1 || 'Not specified'}</p>
                <p><strong className="text-gray-500 dark:text-zinc-400">Primary Stressor:</strong> {assessment.emotions_2 || 'None noted'}</p>
                <p><strong className="text-gray-500 dark:text-zinc-400">Support System:</strong> {assessment.emotions_4 || 'Not specified'}</p>
              </div>
            </div>

            {/* Section 3 */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm text-teal-700 dark:text-teal-400 border-b border-gray-100 dark:border-zinc-800 pb-1">
                3. Memory & Cognitive Retention
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <p><strong className="text-gray-500 dark:text-zinc-400">Initial Words (Leaf-Phone-Chair):</strong> {assessment.memory_initial || 'Not specified'}</p>
                <p><strong className="text-gray-500 dark:text-zinc-400">Recalled Words:</strong> {assessment.memory_recall || 'Not specified'}</p>
              </div>
            </div>

            {/* Section 4 */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm text-teal-700 dark:text-teal-400 border-b border-gray-100 dark:border-zinc-800 pb-1">
                4. Thought & Perception Analysis
              </h3>
              <div className="space-y-1.5 pt-1">
                <p><strong className="text-gray-500 dark:text-zinc-400">Disturbing Thoughts:</strong> {assessment.thoughts_0 || 'None'}</p>
                <p><strong className="text-gray-500 dark:text-zinc-400">Feelings of Persecution:</strong> {assessment.thoughts_1 || 'None'}</p>
                <p><strong className="text-gray-500 dark:text-zinc-400">Auditory/Visual Manifestations:</strong> {assessment.thoughts_2 || 'None'}</p>
                <p><strong className="text-gray-500 dark:text-zinc-400">Dissociation Indicators:</strong> {assessment.thoughts_3 || 'None'}</p>
              </div>
            </div>

            {/* Section 5 */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm text-teal-700 dark:text-teal-400 border-b border-gray-100 dark:border-zinc-800 pb-1">
                5. Insight & Growth Readiness
              </h3>
              <div className="space-y-1.5 pt-1">
                <p><strong className="text-gray-500 dark:text-zinc-400">Empathetic Response:</strong> {assessment.decisions_0 || 'None noted'}</p>
                <p><strong className="text-gray-500 dark:text-zinc-400">Mental Health Value:</strong> {assessment.decisions_1 || 'None noted'}</p>
                <p><strong className="text-gray-500 dark:text-zinc-400">Readiness for Counseling:</strong> {assessment.decisions_2 || 'None noted'}</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-gray-400 dark:text-zinc-500">
            <span>MindCare Confidential Psychological Record</span>
            <Link
              to="/recommendations"
              className="text-teal-600 dark:text-teal-400 font-bold hover:underline"
            >
              Explore Tailored Recommendations &rarr;
            </Link>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};
