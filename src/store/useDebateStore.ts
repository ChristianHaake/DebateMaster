import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Participant {
  id: string;
  name: string;
  speakingTimeMs: number;
}

interface DebateState {
  participants: Participant[];
  activeParticipantId: string | null;
  activeSessionStart: number | null;
  timeLimitMs: number;
  addParticipant: (name: string) => void;
  removeParticipant: (id: string) => void;
  updateParticipant: (id: string, name: string) => void;
  moveParticipant: (id: string, direction: 'up' | 'down') => void;
  switchSpeaker: (id: string | null) => void;
  toggleTimer: () => void;
  addSpeakingTime: (id: string, deltaMs: number) => void;
  setTimeLimit: (limitMs: number) => void;
  resetDebate: () => void;
}

export const useDebateStore = create<DebateState>()(
  persist(
    (set) => ({
      participants: [],
      activeParticipantId: null,
      activeSessionStart: null,
      timeLimitMs: 0,
      
      addParticipant: (name) =>
        set((state) => ({
          participants: [
            ...state.participants,
            { id: crypto.randomUUID(), name, speakingTimeMs: 0 },
          ],
        })),
        
      removeParticipant: (id) =>
        set((state) => {
          const isActive = state.activeParticipantId === id;
          return {
            participants: state.participants.filter((p) => p.id !== id),
            activeParticipantId: isActive ? null : state.activeParticipantId,
            activeSessionStart: isActive ? null : state.activeSessionStart,
          };
        }),
        
      updateParticipant: (id, name) =>
        set((state) => ({
          participants: state.participants.map((p) =>
            p.id === id ? { ...p, name } : p
          ),
        })),

      moveParticipant: (id, direction) =>
        set((state) => {
          const index = state.participants.findIndex((p) => p.id === id);
          if (index < 0) return state;
          
          const newParticipants = [...state.participants];
          if (direction === 'up' && index > 0) {
            [newParticipants[index - 1], newParticipants[index]] = [newParticipants[index], newParticipants[index - 1]];
          } else if (direction === 'down' && index < newParticipants.length - 1) {
            [newParticipants[index], newParticipants[index + 1]] = [newParticipants[index + 1], newParticipants[index]];
          } else {
            return state;
          }
          return { participants: newParticipants };
        }),
        
      switchSpeaker: (id) =>
        set((state) => {
          const now = Date.now();
          let nextParticipants = state.participants;
          if (state.activeParticipantId && state.activeSessionStart) {
            const elapsed = now - state.activeSessionStart;
            nextParticipants = nextParticipants.map((p) =>
              p.id === state.activeParticipantId
                ? { ...p, speakingTimeMs: p.speakingTimeMs + elapsed }
                : p
            );
          }
          return {
            participants: nextParticipants,
            activeParticipantId: id,
            activeSessionStart: id !== null ? now : null,
          };
        }),
        
      toggleTimer: () =>
        set((state) => {
          if (!state.activeParticipantId) return state;
          const now = Date.now();
          if (state.activeSessionStart) {
            const elapsed = now - state.activeSessionStart;
            return {
              participants: state.participants.map((p) =>
                p.id === state.activeParticipantId
                  ? { ...p, speakingTimeMs: Math.max(0, p.speakingTimeMs + elapsed) }
                  : p
              ),
              activeSessionStart: null,
            };
          } else {
            return { activeSessionStart: now };
          }
        }),

      addSpeakingTime: (id, deltaMs) =>
        set((state) => ({
          participants: state.participants.map((p) =>
            p.id === id ? { ...p, speakingTimeMs: Math.max(0, p.speakingTimeMs + deltaMs) } : p
          ),
        })),

      setTimeLimit: (limitMs) =>
        set({ timeLimitMs: Math.max(0, limitMs) }),

      resetDebate: () =>
        set({
          participants: [],
          activeParticipantId: null,
          activeSessionStart: null,
        }),
    }),
    {
      name: 'debatemaster-storage',
    }
  )
);
