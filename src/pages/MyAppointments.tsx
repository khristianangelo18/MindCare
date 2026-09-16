import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Appointment } from '../types/database';

export const MyAppointments: React.FC = () => {
  const { user, profile, specialists } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [cancellingApt, setCancellingApt] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [justBooked, setJustBooked] = useState(false);

  const [greeting, setGreeting] = useState('Good Morning');
  const [currentDateStr, setCurrentDateStr] = useState('');

  useEffect(() => {
    if (searchParams.get('booked') === 'true') {
      setJustBooked(true);
      setTimeout(() => setJustBooked(false), 5000);
    }

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
    setCurrentDateStr(now.toLocaleDateString('en-US', options));
  }, [searchParams]);

  const fetchAppointments = async () => {
    if (!user) return;

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('user_id', user.id)
          .order('appointment_date', { ascending: true })
          .order('appointment_time', { ascending: true });

        if (data && !error) {
          setAppointments(data as Appointment[]);
        }
      } catch (err) {
        console.error('Failed to load appointments from Supabase:', err);
      }
    }

    // Also check local cache
    const stored = localStorage.getItem(`mindcare-appointments-${user.id}`);
    if (stored) {
      const localList: Appointment[] = JSON.parse(stored);
      setAppointments((prev) => {
        // Merge without duplicates by date + time
        const combined = [...prev];
        localList.forEach((item) => {
          if (!combined.some((c) => c.appointment_date === item.appointment_date && c.appointment_time === item.appointment_time)) {
            combined.push(item);
          }
        });
        return combined;
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const handleCancelConfirm = async () => {
    if (!cancellingApt) return;

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('appointments')
          .update({ status: 'Cancelled', notes: cancelReason })
          .eq('id', cancellingApt.id);
      } catch (err) {
        console.error('Failed to cancel appointment in Supabase:', err);
      }
    }

    const updated = appointments.map((a) =>
      a.id === cancellingApt.id
        ? { ...a, status: 'Cancelled' as const, notes: cancelReason }
        : a
    );
    setAppointments(updated);
    if (user) {
      localStorage.setItem(`mindcare-appointments-${user.id}`, JSON.stringify(updated));
    }

    setCancellingApt(null);
    setCancelReason('');
  };

  const filteredAppointments = appointments.filter((apt) => {
    const spec =
      apt.specialist_name ||
      specialists.find((s) => s.id === apt.specialist_id)?.fullname ||
      'Dr. Maria Santos';
    const textMatch =
      spec.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.appointment_date.includes(searchQuery);
    const statusMatch =
      !statusFilter || apt.status.toLowerCase() === statusFilter.toLowerCase();
    return textMatch && statusMatch;
  });

  const userName = profile?.fullname || user?.email?.split('@')[0] || 'User';

  return (
    <div className="main-wrapper">
      {/* Header */}
      <div className="page-header">
        <h1>
          {greeting}, <span className="user-name">{userName}</span>!
        </h1>
        <p className="date-time">Today is {currentDateStr}</p>
      </div>

      {justBooked && (
        <div style={{
          background: '#d4edda',
          color: '#155724',
          padding: '1rem 1.5rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontWeight: 600
        }}>
          ✓ Your appointment has been booked! Check the details below.
        </div>
      )}

      {/* Filter and Title Header */}
      <div className="filter-wrapper">
        <h2 className="section-heading" style={{ margin: 0 }}>
          My <span className="highlight">Appointments</span>
        </h2>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            className="search-input"
            placeholder="Search specialist or date..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="status-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Appointment Items */}
      {filteredAppointments.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#5ad0be" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 1rem auto' }}>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <h5 style={{ margin: '0 0 0.5rem 0', fontWeight: 600, color: 'var(--text-dark)' }}>No appointments found</h5>
          <p style={{ margin: '0 0 1.5rem 0' }}>You do not have any scheduled appointments matching your filter.</p>
          <Link to="/book-appointment" className="card-link" style={{ fontSize: '1rem' }}>
            Book an Appointment &rarr;
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredAppointments.map((apt) => {
            const specName =
              apt.specialist_name ||
              specialists.find((s) => s.id === apt.specialist_id)?.fullname ||
              'Dr. Maria Santos';
            const specRole =
              apt.specialist_role ||
              specialists.find((s) => s.id === apt.specialist_id)?.specialization ||
              'Clinical Psychologist';

            return (
              <div key={apt.id} className="appointment-item">
                <div className="appointment-info">
                  <h6>{specName}</h6>
                  <div className="appointment-meta">
                    <span>{specRole}</span>
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
                        onClick={() => setCancellingApt(apt)}
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
            );
          })}
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
              <div>
                <strong>Specialist:</strong>{' '}
                {selectedAppointment.specialist_name ||
                  specialists.find((s) => s.id === selectedAppointment.specialist_id)?.fullname ||
                  'Dr. Maria Santos'}
              </div>
              <div><strong>Date:</strong> {selectedAppointment.appointment_date}</div>
              <div><strong>Time:</strong> {selectedAppointment.appointment_time}</div>
              <div>
                <strong>Status:</strong>{' '}
                <span className={`status-badge status-${selectedAppointment.status.toLowerCase()}`}>
                  {selectedAppointment.status}
                </span>
              </div>
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

      {/* Cancel Modal */}
      {cancellingApt && (
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
              Are you sure you want to cancel this appointment on{' '}
              <strong>{cancellingApt.appointment_date}</strong>?
            </p>
            <div style={{ margin: '1rem 0' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                Reason for Cancellation (Optional):
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please let us know why you are cancelling..."
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
                onClick={() => setCancellingApt(null)}
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
                onClick={handleCancelConfirm}
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
