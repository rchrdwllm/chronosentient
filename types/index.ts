export type JournalEntry = {
  id: string; // Unique identifier (UUID)
  date: string; // ISO date string (e.g., 2025-04-29)
  day: string; // Day of the week (e.g., Tuesday)
  mood: string;
  emoji: string;
  text: string;
};
