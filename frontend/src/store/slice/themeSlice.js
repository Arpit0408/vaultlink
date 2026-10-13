import { createSlice } from "@reduxjs/toolkit";

const getInitialTheme = () => {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem("vaultlink-theme");
  if (saved) return saved;
  return "light";
};

const initialTheme = getInitialTheme();
if (typeof document !== "undefined") {
  if (initialTheme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    mode: initialTheme,
  },
  reducers: {
    toggleTheme: (state) => {
      const nextTheme = state.mode === "dark" ? "light" : "dark";
      state.mode = nextTheme;
      localStorage.setItem("vaultlink-theme", nextTheme);
      if (nextTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
      localStorage.setItem("vaultlink-theme", action.payload);
      if (action.payload === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
