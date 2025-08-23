'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserStore } from './user.type';

export const useUser = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      isAuthenticated: () => !!get().user && !!get().token,

      login: ({ user }) => {
        set({ user });
      },

      logout: () => {
        set({ user: null, token: null });
      },

      setUser: (user) => set({ user }),

      updateUser: (patch) => {
        const current = get().user;
        if (!current) return;
        set({ user: { ...current, ...patch } });
      },

      setToken: (token) => set({ token }),
    }),
    {
      name: 'auth', // clé localStorage
      storage: createJSONStorage(() => localStorage),
      // version: 1, // si tu veux gérer des migrations
      // migrate: (state, version) => state, // pour upgrader
      partialize: (state) => ({ user: state.user, token: state.token }), // on persiste seulement ces champs
    }
  )
);