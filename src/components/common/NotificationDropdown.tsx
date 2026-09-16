import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Info } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { InAppNotification } from '../../types/database';

export const NotificationDropdown: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<InAppNotification[]>([
    {
      id: 1,
      user_id: user?.id || 'demo',
      message: 'Welcome to MindCare! You can take your first assessment or book a specialist.',
      is_read: false,
      created_at: new Date().toISOString()
    }
  ]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    if (!user) return;
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (data && !error) {
          setNotifications(data as InAppNotification[]);
        }
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      }
    }
  };

  useEffect(() => {
    fetchNotifications();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [user]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markAllAsRead = async () => {
    const updated = notifications.map(n => ({ ...n, is_read: true }));
    setNotifications(updated);

    if (user && isSupabaseConfigured) {
      try {
        await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('user_id', user.id);
      } catch (err) {
        console.error('Error marking notifications as read:', err);
      }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-teal-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-900">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-100 dark:border-zinc-800">
            <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
              Notifications ({unreadCount})
            </h4>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-gray-50 dark:divide-zinc-800/60">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400 dark:text-zinc-500">
                No notifications right now
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  className={`p-3.5 text-xs transition-colors flex items-start gap-2.5 ${
                    !n.is_read
                      ? 'bg-teal-50/40 dark:bg-teal-950/20 text-gray-900 dark:text-gray-100 font-medium'
                      : 'text-gray-600 dark:text-zinc-400'
                  }`}
                >
                  <span className="mt-0.5 p-1 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400">
                    <Info className="w-3 h-3" />
                  </span>
                  <div className="flex-1">
                    <p className="leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-gray-400 dark:text-zinc-500 mt-1 block">
                      {new Date(n.created_at).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
