import { create } from 'zustand';

export interface Participant {
  id: string;
  name: string;
  speakingTimeMs: number;
}

interface DebateState {
  participants: Participant[];
  activeParticipantId: string | null;
  isTimerRunning: boolean;
  addParticipant: (name: string) => void;
  removeParticipant: (id: string) => void;
  updateParticipant: (id: string, name: string) => void;
  switchSpeaker: (id: string | null) => void;
  toggleTimer: () => void;
  tickTimer: (deltaMs: number) => void;
}

export const useDebateStore = create<DebateState>((set) => ({
  participants: [],
  activeParticipantId: null,
  isTimerRunning: false,
  addParticipant: (name) =>
    set((state) => ({
      participants: [
        ...state.participants,
        { id: crypto.randomUUID(), name, speakingTimeMs: 0 },
      ],
    })),
  removeParticipant: (id) =>
    set((state) => ({
      participants: state.participants.filter((p) => p.id !== id),
      activeParticipantId: state.activeParticipantId === id ? null : state.activeParticipantId,
      isTimerRunning: state.activeParticipantId === id ? false : state.isTimerRunning,
    })),
  updateParticipant: (id, name) =>
    set((state) => ({
      participants: state.participants.map((p) =>
        p.id === id ? { ...p, name } : p
      ),
    })),
  switchSpeaker: (id) =>
    set(() => ({
      activeParticipantId: id,
      isTimerRunning: id !== null,
    })),
  toggleTimer: () =>
    set((state) => {
      if (!state.activeParticipantId) return state;
      return { isTimerRunning: !state.isTimerRunning };
    }),
  tickTimer: (deltaMs) =>
    set((state) => {
      if (!state.isTimerRunning || !state.activeParticipantId) return state;
      return {
        participants: state.participants.map((p) =>
          p.id === state.activeParticipantId
            ? { ...p, speakingTimeMs: p.speakingTimeMs + deltaMs }
            : p
        ),
      };
    }),
}));
