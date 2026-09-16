export type UserRole = 'Patient' | 'Specialist' | 'Admin';

export interface UserProfile {
  id: string;
  fullname: string;
  email: string;
  role: UserRole;
  age?: number | null;
  gender?: string | null;
  phone?: string | null;
  bio?: string | null;
  specialization?: string | null;
  experience?: string | null;
  location?: string | null;
  avatar_url?: string | null;
  created_at?: string;
}

export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface Appointment {
  id: number;
  user_id: string;
  specialist_id: string;
  specialist_name?: string | null;
  specialist_role?: string | null;
  appointment_date: string;
  appointment_time: string;
  status: AppointmentStatus;
  notes?: string | null;
  created_at?: string;
  specialist?: UserProfile;
  patient?: UserProfile;
}

export interface Assessment {
  id: number;
  user_id: string;
  score: number;
  summary: string;
  
  // Section 1
  orientation_0?: string;
  orientation_1?: string;
  orientation_2?: string;
  orientation_3?: string;
  orientation_4?: string;
  
  // Section 2
  emotions_0?: string;
  emotions_1?: string;
  emotions_2?: string;
  emotions_3?: string;
  emotions_4?: string;
  
  // Section 3
  memory_initial?: string;
  memory_recall?: string;
  
  // Section 4
  thoughts_0?: string;
  thoughts_1?: string;
  thoughts_2?: string;
  thoughts_3?: string;
  
  // Section 5
  decisions_0?: string;
  decisions_1?: string;
  decisions_2?: string;
  
  // Section 6
  q1?: number;
  q2?: number;
  
  created_at?: string;
}

export interface PreAssessmentResult {
  score: number;
  summary: string;
  q1: number;
  q2: number;
  q3: number;
  timestamp?: number;
}

export interface InAppNotification {
  id: number;
  user_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
