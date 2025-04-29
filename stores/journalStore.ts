import { WEEK_JOURNAL_ENTRIES } from "@/constants/journalData";
import { create } from "zustand";
import { JournalEntry } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface JournalState {
  entries: JournalEntry[];
  addEntry: (entry: JournalEntry) => void;
  updateEntry: (date: string, updated: Partial<JournalEntry>) => void;
  setEntries: (entries: JournalEntry[]) => void;
  deleteEntry: (date: string) => void;
}

export const useJournalStore = create<JournalState>((set, get) => ({
  entries: WEEK_JOURNAL_ENTRIES,
  addEntry: async (entry) => {
    set((state) => ({ entries: [...state.entries, entry] }));
    await AsyncStorage.setItem(
      "journalEntries",
      JSON.stringify(get().entries.concat(entry))
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
}));

// Load entries from AsyncStorage on app start
(async () => {
  const data = await AsyncStorage.getItem("journalEntries");
  if (data) {
    useJournalStore.getState().setEntries(JSON.parse(data));
  }
})();
