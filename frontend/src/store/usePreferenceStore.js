import { create } from "zustand";

export const usePreferenceStore = create((set) => ({
  autoTranslate: true,
  setAutoTranslate: (value) => {
    set({ autoTranslate: value });
    localStorage.setItem("autoTranslate", JSON.stringify(value));
  },
  initPreference: () => {
    const stored = localStorage.getItem("autoTranslate");
    if (stored !== null) set({ autoTranslate: JSON.parse(stored) });
  },
}));
