import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserProgress, ProgressStatus } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  login: (email: string, password: string, name?: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (name: string) => Promise<void>;
  restoreSession: () => Promise<void>;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Progress
  progress: Record<string, UserProgress>;
  setProgress: (productId: string, status: ProgressStatus, percent?: number) => void;
  getProgress: (productId: string) => UserProgress | null;

  // Notes
  notes: Record<string, string>;
  setNote: (productId: string, note: string) => void;
  getNote: (productId: string) => string;

  // Streak
  streak: number;
  lastActiveDate: string | null;
  updateStreak: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      isAuthenticated: false,
      authLoading: false,

      restoreSession: async () => {
        if (!isSupabaseConfigured()) return;

        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const user: User = {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
              createdAt: session.user.created_at || new Date().toISOString(),
            };
            set({ user, isAuthenticated: true });
          }
        } catch (e) {
          console.log('Session restore error', e);
        }
      },

      login: async (email, password) => {
        set({ authLoading: true });

        // Real Supabase auth
        if (isSupabaseConfigured()) {
          try {
            const { data, error } = await supabase.auth.signInWithPassword({
              email: email.trim().toLowerCase(),
              password,
            });

            if (error) {
              set({ authLoading: false });
              return { error: error.message };
            }

            if (data.user) {
              const user: User = {
                id: data.user.id,
                email: data.user.email || email,
                name: data.user.user_metadata?.name || email.split('@')[0],
                createdAt: data.user.created_at || new Date().toISOString(),
              };
              set({ user, isAuthenticated: true, authLoading: false });
              get().updateStreak();
              return {};
            }
          } catch (e: any) {
            set({ authLoading: false });
            return { error: e.message || 'Login failed' };
          }
        }

        // Fallback local auth (when Supabase keys are not set)
        const user: User = {
          id: Date.now().toString(),
          email: email.trim().toLowerCase(),
          name: email.split('@')[0],
          createdAt: new Date().toISOString(),
        };
        set({ user, isAuthenticated: true, authLoading: false });
        get().updateStreak();
        return {};
      },

      signUp: async (email, password, name) => {
        set({ authLoading: true });

        if (isSupabaseConfigured()) {
          try {
            const { data, error } = await supabase.auth.signUp({
              email: email.trim().toLowerCase(),
              password,
              options: {
                data: { name: name.trim() },
              },
            });

            if (error) {
              set({ authLoading: false });
              return { error: error.message };
            }

            if (data.user) {
              const user: User = {
                id: data.user.id,
                email: data.user.email || email,
                name: name.trim() || email.split('@')[0],
                createdAt: data.user.created_at || new Date().toISOString(),
              };
              set({ user, isAuthenticated: true, authLoading: false });
              get().updateStreak();
              return {};
            }
          } catch (e: any) {
            set({ authLoading: false });
            return { error: e.message || 'Sign up failed' };
          }
        }

        // Fallback local
        const user: User = {
          id: Date.now().toString(),
          email: email.trim().toLowerCase(),
          name: name.trim() || email.split('@')[0],
          createdAt: new Date().toISOString(),
        };
        set({ user, isAuthenticated: true, authLoading: false });
        get().updateStreak();
        return {};
      },

      logout: async () => {
        if (isSupabaseConfigured()) {
          await supabase.auth.signOut();
        }
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: async (name) => {
        const current = get().user;
        if (!current) return;

        if (isSupabaseConfigured()) {
          await supabase.auth.updateUser({ data: { name } });
        }
        set({ user: { ...current, name } });
      },

      // Wishlist
      wishlist: [],
      toggleWishlist: (productId) => {
        const current = get().wishlist;
        if (current.includes(productId)) {
          set({ wishlist: current.filter((id) => id !== productId) });
        } else {
          set({ wishlist: [...current, productId] });
        }
      },
      isInWishlist: (productId) => get().wishlist.includes(productId),

      // Progress
      progress: {},
      setProgress: (productId, status, percent = 0) => {
        const existing = get().progress[productId];
        const newProgress: UserProgress = {
          productId,
          status,
          progressPercent:
            status === 'completed' ? 100 : status === 'not_started' ? 0 : percent || existing?.progressPercent || 25,
          lastUpdated: new Date().toISOString(),
        };
        set({
          progress: {
            ...get().progress,
            [productId]: newProgress,
          },
        });
        get().updateStreak();
      },
      getProgress: (productId) => get().progress[productId] || null,

      // Notes
      notes: {},
      setNote: (productId, note) => {
        set({
          notes: {
            ...get().notes,
            [productId]: note,
          },
        });
      },
      getNote: (productId) => get().notes[productId] || '',

      // Streak
      streak: 0,
      lastActiveDate: null,
      updateStreak: () => {
        const today = new Date().toDateString();
        const last = get().lastActiveDate;
        if (last === today) return;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        if (last === yesterdayStr) {
          set({ streak: get().streak + 1, lastActiveDate: today });
        } else {
          set({ streak: 1, lastActiveDate: today });
        }
      },
    }),
    {
      name: 'grow-with-benedict-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Persist local data even when using real auth
        wishlist: state.wishlist,
        progress: state.progress,
        notes: state.notes,
        streak: state.streak,
        lastActiveDate: state.lastActiveDate,
        // We restore user from Supabase session instead
      }),
    }
  )
);
