import React, { useState, useEffect } from 'react';
import { Menu, X, PhoneCall, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NotificationDropdown } from './NotificationDropdown';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu, isMobileMenuOpen }) => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      setCurrentDateTime(formatted);
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 transition-colors">
      {/* Left side: Hamburger & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-xl text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="hidden sm:block">
          <p className="text-xs text-gray-500 dark:text-zinc-400 font-medium">
            {currentDateTime}
          </p>
        </div>
      </div>

      {/* Right side: Crisis Hotline, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Crisis Hotline Quick Action */}
        <a
          href="tel:988"
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-300 text-xs font-semibold hover:bg-rose-100 transition-colors"
          title="National Crisis & Suicide Lifeline"
        >
          <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
          <span>24/7 Lifeline: 988</span>
        </a>

        {/* Notifications */}
        <NotificationDropdown />

        {/* Profile Avatar & Name */}
        {profile && (
          <div
            onClick={() => navigate(profile.role === 'Specialist' ? '/specialist/profile' : '/profile')}
            className="flex items-center gap-2.5 pl-2 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-teal-500/30 group-hover:border-teal-500 transition-colors bg-teal-100 dark:bg-teal-950 flex items-center justify-center">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.fullname}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <User className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              )}
            </div>
            <div className="hidden sm:block text-left">
              <span className="block text-xs font-semibold text-gray-900 dark:text-gray-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                {profile.fullname}
              </span>
              <span className="block text-[10px] text-gray-400 dark:text-zinc-500 capitalize">
                {profile.role}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
