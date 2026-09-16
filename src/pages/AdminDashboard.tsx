import React, { useEffect, useState } from 'react';
import { ShieldCheck, Calendar, Clock, User, Filter, Search } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Appointment, AppointmentStatus } from '../types/database';

export const AdminDashboard: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchAllAppointments = async () => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            *,
            patient:user_id (id, fullname, email),
            specialist:specialist_id (id, fullname, email, specialization)
          `)
          .order('appointment_date', { ascending: false });

        if (data && !error) {
          setAppointments(data as unknown as Appointment[]);
        }
      } catch (err) {
        console.error('Admin query error:', err);
      }
    } else {
      // Demo appointments
      setAppointments([
        {
          id: 1,
          user_id: 'p1',
          specialist_id: 's1',
          appointment_date: '2025-11-20',
          appointment_time: '09:00:00',
          status: 'Confirmed',
          notes: 'Standard consultation',
          patient: { id: 'p1', fullname: 'Michael Dungog', email: 'michael@example.com', role: 'Patient' },
          specialist: { id: 's1', fullname: 'Dr. Maria Santos', email: 'santos@mindcare.com', role: 'Specialist' }
        },
        {
          id: 2,
          user_id: 'p2',
          specialist_id: 's2',
          appointment_date: '2025-11-22',
          appointment_time: '14:00:00',
          status: 'Pending',
          notes: 'Initial check-in',
          patient: { id: 'p2', fullname: 'Dess Villaflor', email: 'dess@example.com', role: 'Patient' },
          specialist: { id: 's2', fullname: 'Dr. Aris Dela Cruz', email: 'delacruz@mindcare.com', role: 'Specialist' }
        }
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllAppointments();
  }, []);

  const handleStatusChange = async (id: number, newStatus: AppointmentStatus) => {
    if (isSupabaseConfigured) {
      await supabase.from('appointments').update({ status: newStatus }).eq('id', id);
    }
    setAppointments(prev =>
      prev.map(a => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  const filtered = appointments.filter(
    a => filter === 'all' || a.status.toLowerCase() === filter.toLowerCase()
  );

  return (
    <div className="space-y-6 pb-16">
      <div className="bg-gradient-to-r from-teal-500/15 via-teal-500/5 to-transparent p-6 sm:p-8 rounded-3xl border border-teal-500/20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-xs font-semibold mb-2">
          <ShieldCheck className="w-4 h-4" />
          <span>System Administration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
          All Platform Appointments
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 mt-1">
          Master log of all patient and specialist sessions across the MindCare network.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-700 dark:text-zinc-300">
            Records Count: {filtered.length}
          </span>
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-800 dark:text-zinc-200 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-zinc-800/60 text-gray-500 dark:text-zinc-400 font-semibold border-b border-gray-100 dark:border-zinc-800">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Specialist</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
              {filtered.map(apt => (
                <tr key={apt.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/40">
                  <td className="py-3 px-4 font-mono font-bold text-gray-400">
                    #{apt.id}
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    {apt.patient?.fullname || 'Patient'}
                  </td>
                  <td className="py-3 px-4 text-teal-600 dark:text-teal-400 font-medium">
                    {apt.specialist?.fullname || 'Specialist'}
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-zinc-400">
                    {apt.appointment_date} at {apt.appointment_time}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 dark:bg-zinc-800">
                      {apt.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <select
                      value={apt.status}
                      onChange={e => handleStatusChange(apt.id, e.target.value as AppointmentStatus)}
                      className="px-2 py-1 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-[11px]"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
