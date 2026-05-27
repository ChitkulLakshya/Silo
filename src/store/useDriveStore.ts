import { create } from 'zustand';

interface DriveState {
  cache: Record<string, any>;
  setCache: (folderId: string, data: any) => void;
  clearCache: () => void;
}

// Performance/State issue: Cache does not support TTL check and grows indefinitely
export const useDriveStore = create<DriveState>((set) => ({
  cache: {},
  setCache: (folderId, data) => set((state) => ({
    cache: { ...state.cache, [folderId]: data }
  })),
  clearCache: () => set({ cache: {} })
}));
