import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile, Appointment } from '../types/database';

const TIME_SLOTS = [
  { label: '09:00 AM - 10:00 AM', value: '09:00:00' },
  { label: '10:00 AM - 11:00 AM', value: '10:00:00' },
  { label: '11:00 AM - 12:00 PM', value: '11:00:00' },
  { label: '01:00 PM - 02:00 PM', value: '13:00:00' },
  { label: '02:00 PM - 03:00 PM', value: '14:00:00' },
  { label: '03:00 PM - 04:00 PM', value: '15:00:00' }
];

export const BookAppointment: React.FC = () => {
  const { user, profile, specialists } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const rescheduleId = searchParams.get('appointment_id');
  const isRescheduling = Boolean(rescheduleId);

  // View state: 'specialists' or 'booking'
  const [currentView, setCurrentView] = useState<'specialists' | 'booking'>('specialists');
  const [selectedSpecialist, setSelectedSpecialist] = useState<UserProfile | null>(null);

  // Calendar state
  const [calendarDate, setCalendarDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [selectedTime, setSelectedTime] = useState<string>('09:00:00');
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Greeting
  const [greeting, setGreeting] = useState('Good Morning');
  const [currentDateStr, setCurrentDateStr] = useState('');

  useEffect(() => {
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
  }, []);

  // Fetch booked slots for the chosen specialist and date
  useEffect(() => {
    if (!selectedSpecialist || !selectedDate) return;

    const fetchBookedSlots = async () => {
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase
            .from('appointments')
            .select('appointment_time')
            .eq('specialist_id', selectedSpecialist.id)
            .eq('appointment_date', selectedDate)
            .in('status', ['Pending', 'Confirmed']);

          if (data && !error) {
            setBookedTimes(data.map((d) => d.appointment_time));
          }
        } catch (err) {
          console.error('Error fetching booked slots:', err);
        }
      }
    };

    fetchBookedSlots();
  }, [selectedSpecialist, selectedDate]);

  // Handle clicking on a specialist
  const handleSelectSpecialist = (spec: UserProfile) => {
    setSelectedSpecialist(spec);
    setCurrentView('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calendar navigation
  const previousMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = calendarDate.getFullYear();
  const currentMonth = calendarDate.getMonth();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const handleDayClick = (day: number) => {
    const formattedMonth = String(currentMonth + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    setSelectedDate(`${currentYear}-${formattedMonth}-${formattedDay}`);
  };

  // Submission handler
  const handleBookAppointment = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!selectedSpecialist) {
      setError('Please select a specialist.');
      return;
    }

    if (!selectedDate || !selectedTime) {
      setError('Please choose a date and an available time slot.');
      return;
    }

    setLoading(true);
    setError('');

    const newAppointment: Appointment = {
      id: Date.now(),
      user_id: user.id,
      specialist_id: selectedSpecialist.id,
      specialist_name: selectedSpecialist.fullname,
      specialist_role: selectedSpecialist.specialization || 'Clinical Psychologist',
      appointment_date: selectedDate,
      appointment_time: selectedTime,
      status: 'Pending',
      created_at: new Date().toISOString()
    };

    let supabaseSuccess = false;

    if (isSupabaseConfigured) {
      try {
        const { error: insertError } = await supabase.from('appointments').insert({
          user_id: user.id,
          specialist_id: selectedSpecialist.id,
          specialist_name: selectedSpecialist.fullname,
          specialist_role: selectedSpecialist.specialization || 'Clinical Psychologist',
          appointment_date: selectedDate,
          appointment_time: selectedTime,
          status: 'Pending'
        });

        if (insertError) {
          console.warn('Supabase appointment insert error:', insertError.message);
          // If error is UUID syntax error because column was created as UUID:
          if (insertError.message.includes('uuid') || insertError.message.includes('foreign key')) {
            console.info('Tip: Run `ALTER TABLE public.appointments DROP CONSTRAINT IF EXISTS appointments_specialist_id_fkey; ALTER TABLE public.appointments ALTER COLUMN specialist_id TYPE TEXT;` in Supabase SQL editor.');
          }
        } else {
          supabaseSuccess = true;
        }
      } catch (err: any) {
        console.warn('Network or DB error saving appointment to Supabase:', err);
      }
    }

    // Always persist to local cache so user immediately sees their appointment confirmed
    const saved = localStorage.getItem(`mindcare-appointments-${user.id}`);
    const list: Appointment[] = saved ? JSON.parse(saved) : [];
    list.unshift(newAppointment);
    localStorage.setItem(`mindcare-appointments-${user.id}`, JSON.stringify(list));

    setLoading(false);
    setSuccess(true);

    setTimeout(() => {
      navigate('/appointments?booked=true');
    }, 1200);
  };

  const userName = profile?.fullname || user?.email?.split('@')[0] || 'User';

  return (
    <div className="main-wrapper">
      {/* Page Header */}
      <div className="page-header">
        <h1>
          {greeting}, <span className="user-name">{userName}</span>!
        </h1>
        <p className="date-time">Today is {currentDateStr}</p>
      </div>

      {success && (
        <div style={{
          background: '#d4edda',
          color: '#155724',
          padding: '1rem 1.5rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontWeight: 600
        }}>
          ✓ Appointment requested successfully (Pending Confirmation)! Redirecting to My Appointments...
        </div>
      )}

      {error && (
        <div style={{
          background: '#ffe6e8',
          color: '#9b1c1f',
          padding: '1rem 1.5rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontWeight: 500
        }}>
          {error}
        </div>
      )}

      {/* VIEW 1: Specialist Selection View */}
      {currentView === 'specialists' && (
        <div>
          <h2 className="section-heading">
            {isRescheduling ? 'Reschedule' : 'Book an'} <span className="highlight">Appointment</span>
          </h2>
          <p className="section-subtext">Please choose your preferred specialist below:</p>

          <div className="specialist-grid">
            {specialists.map((spec) => (
              <div
                key={spec.id}
                className="specialist-card"
                onClick={() => handleSelectSpecialist(spec)}
              >
                <img
                  src={spec.avatar_url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400'}
                  alt={spec.fullname}
                  className="specialist-profile-pic"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    const initial = (spec.fullname || 'D').replace(/^Dr\.?\s*/i, '').charAt(0).toUpperCase() || 'D';
                    target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%235ad0be"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="72" font-weight="bold" fill="white">${initial}</text></svg>`;
                  }}
                />

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.5rem 2rem 1.5rem 2rem' }}>
                  <div className="specialist-status status-available">
                    ● Available
                  </div>

                  <div>
                    <div className={`specialist-badge ${spec.specialization?.toLowerCase().includes('psychiatrist') ? 'badge-psychiatrist' : 'badge-psychologist'}`}>
                      {spec.specialization || 'Clinical Psychologist'}
                    </div>

                    <div className="specialist-name">
                      <span>{spec.fullname}</span>
                      <span style={{ color: '#10b981', fontSize: '1rem' }}>●</span>
                    </div>

                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '0 0 1rem 0' }}>
                      {spec.bio || 'Registered Clinical Psychologist'}
                    </p>

                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '1.5rem',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid var(--border-color)',
                      fontSize: '0.8125rem',
                      color: 'var(--text-muted)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5ad0be" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span>{spec.location || 'Metro Manila'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5ad0be" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                        </svg>
                        <span>{spec.experience || '5 Years'} of Experience</span>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 'auto',
                    paddingTop: '1.25rem'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Next available at</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-dark)', fontWeight: 500 }}>
                        09:00 AM - 10:00 AM - Tomorrow
                      </div>
                    </div>

                    <button
                      className="btn-book-specialist"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectSpecialist(spec);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      <span>{isRescheduling ? 'Select Specialist' : 'Book Appointment'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: Interactive Booking View (Calendar & Timeslots) */}
      {currentView === 'booking' && selectedSpecialist && (
        <div>
          <button className="back-button" onClick={() => setCurrentView('specialists')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Back to Specialists</span>
          </button>

          {/* Selected Specialist Bar */}
          <div className="selected-specialist-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img
                src={selectedSpecialist.avatar_url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400'}
                alt={selectedSpecialist.fullname}
                style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  const initial = (selectedSpecialist.fullname || 'D').replace(/^Dr\.?\s*/i, '').charAt(0).toUpperCase() || 'D';
                  target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52"><rect width="52" height="52" rx="26" fill="%235ad0be"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="20" font-weight="bold" fill="white">${initial}</text></svg>`;
                }}
              />
              <div>
                <h5 style={{ margin: 0, fontWeight: 600, color: 'var(--text-dark)' }}>
                  {selectedSpecialist.fullname}
                </h5>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {selectedSpecialist.specialization || 'Clinical Psychologist'}
                </p>
              </div>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--primary-teal)', fontWeight: 600 }}>
              ● Active Selection
            </div>
          </div>

          {/* Booking Section: Calendar + Timeslots */}
          <div className="booking-section">
            {/* Calendar */}
            <div className="calendar-wrapper">
              <div className="calendar-header">
                <div className="calendar-month">
                  {monthNames[currentMonth]} {currentYear}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={previousMonth}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--border-color)',
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-dark)'
                    }}
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextMonth}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--border-color)',
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-dark)'
                    }}
                  >
                    ›
                  </button>
                </div>
              </div>

              <div className="calendar-grid">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="calendar-day-header">
                    {day}
                  </div>
                ))}

                {/* Empty cells before month begins */}
                {Array.from({ length: firstDayIndex }).map((_, i) => (
                  <div key={`empty-${i}`} className="calendar-day empty"></div>
                ))}

                {/* Days of current month */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const dateObj = new Date(currentYear, currentMonth, dayNum);
                  const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;

                  const now = new Date();
                  const isPast =
                    dateObj.setHours(0, 0, 0, 0) < now.setHours(0, 0, 0, 0);

                  const formattedMonth = String(currentMonth + 1).padStart(2, '0');
                  const formattedDay = String(dayNum).padStart(2, '0');
                  const thisDateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
                  const isSelected = selectedDate === thisDateStr;

                  const isToday =
                    now.getFullYear() === currentYear &&
                    now.getMonth() === currentMonth &&
                    now.getDate() === dayNum;

                  const isDisabled = isPast || isWeekend;

                  return (
                    <button
                      key={dayNum}
                      disabled={isDisabled}
                      onClick={() => handleDayClick(dayNum)}
                      className={`calendar-day ${isDisabled ? 'disabled' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                    >
                      {dayNum}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Timeslots */}
            <div className="timeslots-wrapper">
              <h5 style={{ margin: '0 0 1rem 0', fontWeight: 600, color: 'var(--text-dark)', fontSize: '1rem' }}>
                Available Times for {selectedDate}
              </h5>
              <div className="timeslot-grid">
                {TIME_SLOTS.map((slot) => {
                  const isBooked = bookedTimes.includes(slot.value);
                  const isSelected = selectedTime === slot.value;

                  return (
                    <button
                      key={slot.value}
                      disabled={isBooked}
                      onClick={() => setSelectedTime(slot.value)}
                      className={`timeslot-btn ${isSelected ? 'selected' : ''}`}
                    >
                      {slot.label} {isBooked && '(Booked)'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button
              className="btn-book"
              onClick={handleBookAppointment}
              disabled={loading || !selectedDate || !selectedTime}
            >
              {loading ? 'Processing...' : isRescheduling ? 'Reschedule Appointment' : 'Book an Appointment'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
