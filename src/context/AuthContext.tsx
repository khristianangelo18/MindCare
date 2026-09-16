import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile, UserRole } from '../types/database';

export const DEFAULT_SPECIALISTS: UserProfile[] = [
  {
    id: 'spec-1',
    fullname: 'Dr. Maria Santos',
    email: 'santos@mindcare.com',
    role: 'Specialist',
    specialization: 'Clinical Psychologist',
    experience: '8 Years',
    location: 'Makati, Metro Manila',
    bio: 'Specializing in cognitive behavioral therapy (CBT), anxiety reduction, stress management, and emotional regulation.',
    avatar_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'spec-2',
    fullname: 'Dr. Aris Dela Cruz',
    email: 'delacruz@mindcare.com',
    role: 'Specialist',
    specialization: 'Psychiatrist & Psychotherapist',
    experience: '12 Years',
    location: 'Quezon City, Metro Manila',
    bio: 'Dedicated to helping adults and youth navigate depression, trauma, career burnout, and mood stabilization.',
    avatar_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'spec-3',
    fullname: 'Dr. Elena Reyes',
    email: 'reyes@mindcare.com',
    role: 'Specialist',
    specialization: 'Counseling Psychologist',
    experience: '6 Years',
    location: 'BGC, Taguig',
    bio: 'Focusing on relationship counseling, mindfulness practices, self-worth development, and grief processing.',
    avatar_url: 'https://images.unsplash.com/photo-1594824813583-057bfd62057d?auto=format&fit=crop&q=80&w=400'
  }
];

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  role: UserRole;
  loading: boolean;
  signIn: (email: string, password: string, preferredRole?: UserRole) => Promise<{ error?: string }>;
  signUp: (data: { email: string; password: string; fullname: string; age?: number; gender?: string; role?: UserRole }) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error?: string }>;
  specialists: UserProfile[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [specialists, setSpecialists] = useState<UserProfile[]>(DEFAULT_SPECIALISTS);

  // Load profile from Supabase or localStorage
  const fetchProfile = async (userId: string, userEmail: string) => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (data && !error) {
          setProfile(data as UserProfile);
          return data;
        }
      } catch (err) {
        console.error('Error fetching profile from Supabase:', err);
      }
    }

    // Fallback: check localStorage for saved local profile
    const saved = localStorage.getItem(`mindcare-profile-${userId}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setProfile(parsed);
      return parsed;
    }

    // Default guest profile
    const defaultProfile: UserProfile = {
      id: userId,
      fullname: userEmail.split('@')[0] || 'User',
      email: userEmail,
      role: 'Patient',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
    };
    setProfile(defaultProfile);
    return defaultProfile;
  };

  // Load specialists list
  const fetchSpecialists = async () => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'Specialist');

        if (data && data.length > 0 && !error) {
          setSpecialists(data as UserProfile[]);
          return;
        }
      } catch (err) {
        console.error('Failed to load specialists from Supabase:', err);
      }
    }
    // Keep DEFAULT_SPECIALISTS fallback
    setSpecialists(DEFAULT_SPECIALISTS);
  };

  useEffect(() => {
    fetchSpecialists();

    if (isSupabaseConfigured) {
      // Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user);
          fetchProfile(session.user.id, session.user.email || '');
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      });

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id, session.user.email || '');
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // Offline/Local Demo Mode
      const localUserStr = localStorage.getItem('mindcare-demo-user');
      if (localUserStr) {
        const localUser = JSON.parse(localUserStr);
        setUser({ id: localUser.id, email: localUser.email } as User);
        setProfile(localUser);
      }
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string, preferredRole: UserRole = 'Patient') => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        setUser(data.user);
        const userProf = await fetchProfile(data.user.id, data.user.email || email);
        if (preferredRole === 'Specialist' && userProf?.role !== 'Specialist' && userProf?.role !== 'Admin') {
          // Warning if logging into specialist portal without specialist role
          console.warn('Logging into specialist area with role:', userProf?.role);
        }
      }
      return {};
    } else {
      // Demo authentication
      const demoId = `demo-user-${email.replace(/[^a-zA-Z0-9]/g, '')}`;
      const demoProfile: UserProfile = {
        id: demoId,
        fullname: email.split('@')[0].toUpperCase(),
        email: email,
        role: preferredRole,
        age: 24,
        gender: 'Other',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
      };
      localStorage.setItem('mindcare-demo-user', JSON.stringify(demoProfile));
      setUser({ id: demoId, email } as User);
      setProfile(demoProfile);
      return {};
    }
  };

  const signUp = async (data: {
    email: string;
    password: string;
    fullname: string;
    age?: number;
    gender?: string;
    role?: UserRole;
  }) => {
    const userRole = data.role || 'Patient';

    if (isSupabaseConfigured) {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            fullname: data.fullname,
            age: data.age,
            gender: data.gender,
            role: userRole
          }
        }
      });

      if (error) {
        return { error: error.message };
      }

      // Also directly insert into profiles in case trigger is not active
      if (authData.user) {
        const newProfile: UserProfile = {
          id: authData.user.id,
          fullname: data.fullname,
          email: data.email,
          role: userRole,
          age: data.age,
          gender: data.gender,
          avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
        };
        await supabase.from('profiles').upsert(newProfile);
        setUser(authData.user);
        setProfile(newProfile);
      }
      return {};
    } else {
      // Local demo sign up
      const demoId = `demo-user-${Date.now()}`;
      const demoProfile: UserProfile = {
        id: demoId,
        fullname: data.fullname,
        email: data.email,
        role: userRole,
        age: data.age,
        gender: data.gender,
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
      };
      localStorage.setItem('mindcare-demo-user', JSON.stringify(demoProfile));
      setUser({ id: demoId, email: data.email } as User);
      setProfile(demoProfile);
      return {};
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('mindcare-demo-user');
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return { error: 'No active profile found' };

    const updated = { ...profile, ...updates };

    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id);

      if (error) return { error: error.message };
    }

    localStorage.setItem(`mindcare-profile-${profile.id}`, JSON.stringify(updated));
    setProfile(updated);
    return {};
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role: profile?.role || 'Patient',
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        specialists
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
