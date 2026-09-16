import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Clock,
  Search,
  Filter,
  Save
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Appointment, AppointmentStatus } from '../types/database';

export const SpecialistDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Tracks staged status changes before clicking Update
  const [draftStatuses, setDraftStatuses] = useState<Record<number, AppointmentStatus>>({});

  const fetchAppointments = async () => {
    if (!user) return;

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            *,
            patient:user_id (
              id, fullname, email, gender, age, phone
            )
          `)
          .eq('specialist_id', user.id)
          .order('appointment_date', { ascending: false });

        if (data && !error) {
          const list = data as unknown as Appointment[];
          setAppointments(list);
          // Pre-fill initial draft statuses
          const initialDrafts: Record<number, AppointmentStatus> = {};
          list.forEach(a => {
            initialDrafts[a.id] = a.status;
          });
          setDraftStatuses(initialDrafts);
        }
      } catch (err) {
        console.error('Error fetching specialist appointments:', err);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  // Stage status change locally
  const handleDropdownDraftChange = (appointmentId: number, stagedStatus: AppointmentStatus) => {
    setDraftStatuses(prev => ({
      ...prev,
      [appointmentId]: stagedStatus
    }));
  };

  // Commit the update to Supabase on button click
  const handleSaveStatus = async (appointmentId: number) => {
    const targetStatus = draftStatuses[appointmentId];
    if (!targetStatus) return;

    setUpdatingId(appointmentId);

    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('appointments')
        .update({ status: targetStatus })
        .eq('id', appointmentId);

      if (error) {
        alert('Failed to update status: ' + error.message);
      } else {
        setAppointments(prev =>
          prev.map(a => (a.id === appointmentId ? { ...a, status: targetStatus } : a))
        );
      }
    } else {
      setAppointments(prev =>
        prev.map(a => (a.id === appointmentId ? { ...a, status: targetStatus } : a))
      );
    }

    setUpdatingId(null);
  };

  const total = appointments.length;
  const confirmed = appointments.filter(a => a.status === 'Confirmed').length;
  const pending = appointments.filter(a => a.status === 'Pending').length;
  const completed = appointments.filter(a => a.status === 'Completed').length;
  const cancelled = appointments.filter(a => a.status === 'Cancelled').length;

  const filtered = appointments.filter(a => {
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
    const patientName = a.patient?.fullname?.toLowerCase() || '';
    return matchesStatus && patientName.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="lg:ml-[260px] p-6 lg:p-8 min-w-0 space-y-8 pb-16 transition-all duration-200">
      {/* Clinic Header */}
      <div className="bg-gradient-to-r from-teal-500/15 via-teal-500/5 to-transparent p-6 sm:p-8 rounded-3xl border border-teal-500/20">
        <span className="inline-block px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-xs font-semibold mb-2">
          Clinical Practitioner Workspace
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
          Specialist Clinic Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 mt-1">
          Welcome, <span className="font-semibold text-teal-600 dark:text-teal-400">{profile?.fullname}</span>.
          Manage patient session queues, confirm bookings, and update clinical appointment states.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm">
          <span className="text-[11px] font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider block">
            Total Sessions
          </span>
          <span className="text-2xl font-black text-gray-900 dark:text-white mt-1 block">
            {total}
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm">
          <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
            Pending
          </span>
          <span className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 block">
            {pending}
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm">
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
            Confirmed
          </span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
            {confirmed}
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm">
          <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
            Completed
          </span>
          <span className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1 block">
            {completed}
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
            Cancelled
          </span>
          <span className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1 block">
            {cancelled}
          </span>
        </div>
      </div>

      {/* Appointment Queue Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search patient by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 focus:outline-none focus:border-teal-500 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 focus:outline-none focus:border-teal-500"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-gray-400">Loading patient schedule...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-xs text-gray-400 dark:text-zinc-500">
            No consultations match your filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-zinc-800/60 text-gray-500 dark:text-zinc-400 font-semibold border-b border-gray-100 dark:border-zinc-800">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4">Notes</th>
                  <th className="py-3 px-4 text-right">Update Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                {filtered.map((apt) => {
                  const currentDraft = draftStatuses[apt.id] || apt.status;
                  const hasChanged = currentDraft !== apt.status;

                  return (
                    <tr key={apt.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-gray-400">
                        #{apt.id}
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <span className="font-bold text-gray-900 dark:text-white block">
                            {apt.patient?.fullname || 'Patient'}
                          </span>
                          <span className="text-[11px] text-gray-400 dark:text-zinc-500">
                            {apt.patient?.email || 'N/A'} • {apt.patient?.gender || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-teal-500" />
                          <span>{apt.appointment_date}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400 mt-0.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{apt.appointment_time}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            apt.status === 'Confirmed'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : apt.status === 'Pending'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                              : apt.status === 'Completed'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate text-gray-500 dark:text-zinc-400">
                        {apt.notes || '—'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <select
                            value={currentDraft}
                            disabled={updatingId === apt.id}
                            onChange={(e) =>
                              handleDropdownDraftChange(apt.id, e.target.value as AppointmentStatus)
                            }
                            className="px-2 py-1.5 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-xs font-semibold text-gray-800 dark:text-zinc-200 focus:outline-none focus:border-teal-500 cursor-pointer"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>

                          <button
                            type="button"
                            disabled={!hasChanged || updatingId === apt.id}
                            onClick={() => handleSaveStatus(apt.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1 transition-all ${
                              hasChanged
                                ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm cursor-pointer'
                                : 'bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-600 cursor-not-allowed'
                            }`}
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>{updatingId === apt.id ? 'Updating...' : 'Update'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};