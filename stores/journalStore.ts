import { WEEK_JOURNAL_ENTRIES } from "@/constants/journalData";
import { create } from "zustand";
import { JournalEntry } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface JournalState {
  entries: JournalEntry[];
  isInitialized: boolean;
  addEntry: (entry: JournalEntry) => void;
  updateEntry: (date: string, updated: Partial<JournalEntry>) => void;
  setEntries: (entries: JournalEntry[]) => void;
  deleteEntry: (date: string) => void;
  initialize: () => Promise<void>;
}

export const useJournalStore = create<JournalState>((set, get) => ({
  entries: [],
  isInitialized: false,
  addEntry: async (entry) => {
    set((state) => ({ entries: [...state.entries, entry] }));
    await AsyncStorage.setItem(
      "journalEntries",
      JSON.stringify(get().entries)
    );
  },
  updateEntry: async (date, updated) => {
    set((state) => ({
      entries: state.entries.map((entry) =>
        entry.date === date ? { ...entry, ...updated } : entry
      ),
    }));
    await AsyncStorage.setItem("journalEntries", JSON.stringify(get().entries));
  },
  setEntries: (entries: JournalEntry[]) => set({ entries }),
  deleteEntry: async (date) => {
    set((state) => ({
      entries: state.entries.filter((entry) => entry.date !== date),
    }));
    await AsyncStorage.setItem(
      "journalEntries",
      JSON.stringify(get().entries.filter((entry) => entry.date !== date))
    );
  },
  initialize: async () => {
    if (get().isInitialized) return;
    
    const data = await AsyncStorage.getItem("journalEntries");
    if (data) {
      set({ entries: JSON.parse(data), isInitialized: true });
    } else {
      // Only use sample data if no stored data exists
      set({ entries: WEEK_JOURNAL_ENTRIES, isInitialized: true });
      await AsyncStorage.setItem("journalEntries", JSON.stringify(WEEK_JOURNAL_ENTRIES));
    }
  }
}));

// Initialize the store when imported
useJournalStore.getState().initialize();
