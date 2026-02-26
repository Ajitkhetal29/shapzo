"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import AppInitializer from "@/components/AppInitializer";
import { ThemeProvider } from "@/contexts/ThemeContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppInitializer>{children}</AppInitializer>
      </ThemeProvider>
    </Provider>
  );
}
