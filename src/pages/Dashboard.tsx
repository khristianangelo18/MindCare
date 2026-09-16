import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Appointment, Assessment } from '../types/database';

export const Dashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [greeting, setGreeting] = useState('Good Morning');
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [activeTab, setActiveTab] = useState<'appointments' | 'assessments'>('appointments');

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [latestAssessment, setLatestAssessment] = useState<Assessment | null>(null);
  const [allAssessments, setAllAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [appointmentSearch, setAppointmentSearch] = useState('');
  const [appointmentStatusFilter, setAppointmentStatusFilter] = useState('');
  const [assessmentSearch, setAssessmentSearch] = useState('');
  const [assessmentStatusFilter, setAssessmentStatusFilter] = useState('');

  // Selected appointment for details modal
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [cancelModalAppointment, setCancelModalAppointment] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    // Current greeting and date formatting
    const updateTime = () => {
      const now = new Date();
      const hour = now.getHours();
      if (hour >= 5 && hour < 12) {
        setGreeting('Good Morning');
      } else if (hour >= 12 && hour < 18) {
        setGreeting('Good Afternoon');
      } else {
        setGreeting('Good Evening');
      }

      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      };
      setCurrentDateTime(now.toLocaleDateString('en-US', options));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    if (isSupabaseConfigured) {
      try {
        // 1. Fetch appointments
        const { data: aptData } = await supabase
          .from('appointments')
          .select('*')
          .eq('user_id', user.id)
          .order('appointment_date', { ascending: true })
          .order('appointment_time', { ascending: true });

        if (aptData) {
          setAppointments(aptData as Appointment[]);
        }

        // 2. Fetch assessments
        const { data: assessData } = await supabase
          .from('assessments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (assessData && assessData.length > 0) {
          setAllAssessments(assessData as Assessment[]);
          setLatestAssessment(assessData[0] as Assessment);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    } else {
      // Local demo fallback
      const savedApts = localStorage.getItem(`mindcare-appointments-${user.id}`);
      if (savedApts) setAppointments(JSON.parse(savedApts));

      const savedAssess = localStorage.getItem(`mindcare-assessments-${user.id}`);
      if (savedAssess) {
        const parsed = JSON.parse(savedAssess);
        setAllAssessments(parsed);
        if (parsed.length > 0) setLatestAssessment(parsed[0]);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  // Cancel appointment handler
  const handleCancelAppointment = async () => {
    if (!cancelModalAppointment) return;

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('appointments')
          .update({ status: 'Cancelled', notes: cancelReason })
          .eq('id', cancelModalAppointment.id);
      } catch (err) {
        console.error('Failed to cancel appointment:', err);
      }
    }

    // Update local state
    const updated = appointments.map((a) =>
      a.id === cancelModalAppointment.id
        ? { ...a, status: 'Cancelled' as const, notes: cancelReason }
        : a
    );
    setAppointments(updated);
    if (user) {
      localStorage.setItem(`mindcare-appointments-${user.id}`, JSON.stringify(updated));
    }

    setCancelModalAppointment(null);
    setCancelReason('');
  };

  // Filtered upcoming appointments count
  const upcomingCount = appointments.filter(
    (a) => a.status === 'Confirmed' || a.status === 'Pending'
  ).length;

  // Filtered appointments list
  const filteredAppointments = appointments.filter((apt) => {
    const specName = apt.specialist_name || 'Dr. Maria Santos';
    const textMatch =
      specName.toLowerCase().includes(appointmentSearch.toLowerCase()) ||
      apt.appointment_date.includes(appointmentSearch);
    const statusMatch =
      !appointmentStatusFilter || apt.status.toLowerCase() === appointmentStatusFilter.toLowerCase();
    return textMatch && statusMatch;
  });

  // Filtered assessments list
  const filteredAssessments = allAssessments.filter((assess) => {
    const textMatch =
      assess.summary.toLowerCase().includes(assessmentSearch.toLowerCase()) ||
      (assess.created_at || '').includes(assessmentSearch);
    const severity = (assess.summary || '').toLowerCase();
    const statusMatch =
      !assessmentStatusFilter || severity.includes(assessmentStatusFilter.toLowerCase());
    return textMatch && statusMatch;
  });

  const getSeverityBadgeClass = (summary: string) => {
    const s = summary.toLowerCase();
    if (s.includes('severe')) return 'score-badge severe';
    if (s.includes('moderate')) return 'score-badge moderate';
    return 'score-badge mild';
  };

  const userName = profile?.fullname || user?.email?.split('@')[0] || 'User';

  return (
    <div className="main-content">
      {/* Header Section */}
      <div className="dashboard-header">
        <h1>
          {greeting}, <span className="user-name">{userName}</span>!
        </h1>
        <div className="date-time">Today is {currentDateTime}</div>
      </div>

      {/* Top 2 Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Card 1: Appointments */}
        <div className="card">
          <div className="card-header-section">
            <div>
              <div className="card-title">Upcoming Appointments</div>
              <div className="card-value">{upcomingCount} Upcoming Appointments</div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#5ad0be" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <Link to="/book-appointment" className="card-link">
            <span>Book an Appointment</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>

        {/* Card 2: Quick Assessment */}
        <div className="card">
          <div className="card-header-section">
            <div>
              <div className="card-title">Quick Assessment Survey</div>
              <div className="card-value">
                {latestAssessment
                  ? `Latest: ${latestAssessment.summary}`
                  : 'No Assessment Taken Yet'}
              </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#5ad0be" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </div>
          <Link to="/recommendations" className="card-link">
            <span>View Recommendations</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          Appointments
        </button>
        <button
          className={`tab-btn ${activeTab === 'assessments' ? 'active' : ''}`}
          onClick={() => setActiveTab('assessments')}
        >
          Assessment History
        </button>
      </div>

      {/* Content: Appointments Tab */}
      {activeTab === 'appointments' && (
        <div>
          {/* Controls / Filter */}
          <div className="filter-wrapper">
            <h5 style={{ margin: 0, fontWeight: 600, color: 'var(--text-dark)', fontSize: '1.1rem' }}>
              Your Appointments
            </h5>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                className="search-input"
                placeholder="Search specialist or date..."
                value={appointmentSearch}
                onChange={(e) => setAppointmentSearch(e.target.value)}
              />
              <select
                className="status-select"
                value={appointmentStatusFilter}
                onChange={(e) => setAppointmentStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <p style={{ margin: '0 0 1rem 0' }}>No appointments found.</p>
              <Link to="/book-appointment" className="card-link" style={{ fontSize: '1rem' }}>
                Schedule your first appointment &rarr;
              </Link>
            </div>
          ) : (
            filteredAppointments.map((apt) => (
              <div key={apt.id} className="appointment-item">
                <div className="appointment-info">
                  <h6>{apt.specialist_name || 'Dr. Maria Santos'}</h6>
                  <div className="appointment-meta">
                    <span>📅 {apt.appointment_date}</span>
                    <span>⏰ {apt.appointment_time}</span>
                  </div>
                </div>

                <div className="appointment-actions">
                  <span className={`status-badge status-${apt.status.toLowerCase()}`}>
                    {apt.status}
                  </span>

                  <button
                    onClick={() => setSelectedAppointment(apt)}
                    style={{
                      padding: '0.4rem 0.8rem',
                      background: 'transparent',
                      border: '1px solid var(--border-color)',
                      borderRadius: '6px',
                      color: 'var(--text-dark)',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    Details
                  </button>

                  {apt.status !== 'Cancelled' && (
                    <>
                      <button
                        onClick={() => navigate(`/book-appointment?appointment_id=${apt.id}`)}
                        style={{
                          padding: '0.4rem 0.8rem',
                          background: 'transparent',
                          border: '1px solid var(--primary-teal)',
                          borderRadius: '6px',
                          color: 'var(--primary-teal)',
                          cursor: 'pointer',
                          fontSize: '0.85rem'
                        }}
                      >
                        Reschedule
                      </button>

                      <button
                        onClick={() => setCancelModalAppointment(apt)}
                        style={{
                          padding: '0.4rem 0.8rem',
                          background: 'transparent',
                          border: '1px solid #ef4444',
                          borderRadius: '6px',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontSize: '0.85rem'
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Content: Assessments Tab */}
      {activeTab === 'assessments' && (
        <div className="card">
          <div className="assessment-header-controls">
            <h5 style={{ margin: 0, fontWeight: 600, color: 'var(--text-dark)', fontSize: '1.1rem' }}>
              Your Assessment Records
            </h5>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                className="search-input"
                placeholder="Search date or summary..."
                value={assessmentSearch}
                onChange={(e) => setAssessmentSearch(e.target.value)}
              />
              <select
                className="status-select"
                value={assessmentStatusFilter}
                onChange={(e) => setAssessmentStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
              </select>
            </div>
          </div>

          {filteredAssessments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <p style={{ margin: '0 0 1rem 0' }}>No assessment history recorded yet.</p>
              <Link to="/assessment" className="btn-print">
                Take Assessment Now
              </Link>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="assessment-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Summary</th>
                    <th>Score</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssessments.map((assess) => (
                    <tr key={assess.id}>
                      <td>{assess.created_at ? new Date(assess.created_at).toLocaleDateString() : 'Recent'}</td>
                      <td>{assess.summary}</td>
                      <td><strong>{assess.score}</strong> / 20</td>
                      <td>
                        <span className={getSeverityBadgeClass(assess.summary)}>
                          {assess.summary.includes('Severe')
                            ? 'Severe'
                            : assess.summary.includes('Moderate')
                            ? 'Moderate'
                            : 'Mild'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <Link to="/assessment-report" className="btn-print">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 6 2 18 2 18 9"></polyline>
                            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                            <rect x="6" y="14" width="12" height="8"></rect>
                          </svg>
                          <span>Print PDF</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="card" style={{ maxWidth: '450px', width: '100%', padding: '2rem' }}>
            <h4 style={{ margin: '0 0 1.5rem 0', fontWeight: 700 }}>Appointment Details</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem' }}>
              <div><strong>Specialist:</strong> {selectedAppointment.specialist_name || 'Dr. Maria Santos'}</div>
              <div><strong>Date:</strong> {selectedAppointment.appointment_date}</div>
              <div><strong>Time:</strong> {selectedAppointment.appointment_time}</div>
              <div><strong>Status:</strong> <span className={`status-badge status-${selectedAppointment.status.toLowerCase()}`}>{selectedAppointment.status}</span></div>
              {selectedAppointment.notes && (
                <div><strong>Notes:</strong> {selectedAppointment.notes}</div>
              )}
            </div>
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                onClick={() => setSelectedAppointment(null)}
                style={{
                  padding: '0.6rem 1.25rem',
                  background: 'var(--primary-teal)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelModalAppointment && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="card" style={{ maxWidth: '450px', width: '100%', padding: '2rem' }}>
            <h4 style={{ margin: '0 0 1rem 0', fontWeight: 700, color: '#ef4444' }}>Cancel Appointment</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Are you sure you want to cancel this appointment with{' '}
              <strong>{cancelModalAppointment.specialist_name || 'Dr. Maria Santos'}</strong> on{' '}
              {cancelModalAppointment.appointment_date}?
            </p>
            <div style={{ margin: '1rem 0' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                Reason for Cancellation (Optional):
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Conflict of schedule, emergency, feeling better..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--card-bg)',
                  color: 'var(--text-dark)',
                  minHeight: '80px',
                  fontSize: '0.875rem'
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                onClick={() => setCancelModalAppointment(null)}
                style={{
                  padding: '0.6rem 1.25rem',
                  background: 'transparent',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  color: 'var(--text-dark)',
                  cursor: 'pointer'
                }}
              >
                Go Back
              </button>
              <button
                onClick={handleCancelAppointment}
                style={{
                  padding: '0.6rem 1.25rem',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
