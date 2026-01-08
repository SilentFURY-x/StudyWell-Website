export interface Subject {
  id: string;
  name: string;
  color: string; // Hex code for the subject tag
  userId: string;
  createdAt: number;
}

export interface StudySession {
  id: string;
  subjectId: string;
  startTime: number;
  endTime: number;
  durationMinutes: number;
  userId: string;
}

// Helper for our Color Picker
export const SUBJECT_COLORS = [
  { name: "Zinc", value: "#71717a" },
  { name: "Red", value: "#ef4444" },
  { name: "Orange", value: "#f97316" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Green", value: "#22c55e" },
  { name: "Emerald", value: "#10b981" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Indigo", value: "#6366f1" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Purple", value: "#a855f7" },
  { name: "Fuchsia", value: "#d946ef" },
  { name: "Pink", value: "#ec4899" },
  { name: "Rose", value: "#f43f5e" },
];