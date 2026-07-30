import { create } from 'zustand';
import { migraineRepository } from '@/repositories/migraineRepository';
import type {
  MigraineEntry,
  CreateMigraineInput,
  UpdateMigraineInput,
} from '@/db/types';

interface MigraineState {
  entries: MigraineEntry[];
  loading: boolean;
  error: string | null;

  // Actions
  loadAll: () => Promise<void>;
  loadByDate: (date: string) => Promise<void>;
  create: (input: CreateMigraineInput) => Promise<MigraineEntry>;
  update: (id: string, input: UpdateMigraineInput) => Promise<void>;
  endNow: (id: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useMigraineStore = create<MigraineState>((set, get) => ({
  entries: [],
  loading: false,
  error: null,

  loadAll: async () => {
    set({ loading: true, error: null });
    try {
      const entries = await migraineRepository.findAll();
      set({ entries, loading: false });
    } catch (e) {
      set({ error: String(e), loading: false });
    }
  },

  loadByDate: async (date: string) => {
    set({ loading: true, error: null });
    try {
      const entries = await migraineRepository.findByDate(date);
      set({ entries, loading: false });
    } catch (e) {
      set({ error: String(e), loading: false });
    }
  },

  create: async (input: CreateMigraineInput) => {
    const entry = await migraineRepository.create(input);
    set((state) => ({ entries: [entry, ...state.entries] }));
    return entry;
  },

  update: async (id: string, input: UpdateMigraineInput) => {
    const updated = await migraineRepository.update(id, input);
    set((state) => ({
      entries: state.entries.map((e) => (e.id === id ? updated : e)),
    }));
  },

  endNow: async (id: string) => {
    const updated = await migraineRepository.endNow(id);
    set((state) => ({
      entries: state.entries.map((e) => (e.id === id ? updated : e)),
    }));
  },

  remove: async (id: string) => {
    await migraineRepository.delete(id);
    set((state) => ({
      entries: state.entries.filter((e) => e.id !== id),
    }));
  },
}));
