import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import {
  applyTextSizeMode,
  applyThemeMode,
  loadTextSizeMode,
  loadThemeMode,
} from "@/lib/user-preferences";

// Keep app stable even if requestIdleCallback isn't supported by the browser.
if (typeof window !== "undefined" && !("requestIdleCallback" in window)) {
  type RequestIdleWindow = Window & {
    requestIdleCallback: (cb: IdleRequestCallback) => number;
    cancelIdleCallback: (id: number) => void;
  };

  const win = window as RequestIdleWindow;
  win.requestIdleCallback = (cb: IdleRequestCallback) => {
    const start = Date.now();
    return window.setTimeout(() => {
      cb({
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
      } as IdleDeadline);
    }, 1);
  };

  win.cancelIdleCallback = (id: number) => {
    window.clearTimeout(id);
  };
}

applyThemeMode(loadThemeMode());
applyTextSizeMode(loadTextSizeMode());

createRoot(document.getElementById("root")!).render(<App />);
