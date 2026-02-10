import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Global error handler for dynamic import failures (version skew)
window.addEventListener('error', (e) => {
    // Check for standard Webpack/Vite chunk load errors
    const isChunkError = 
        /Loading chunk [\d]+ failed/.test(e.message) || 
        /Failed to fetch dynamically imported module/.test(e.message);

    if (isChunkError) {
        console.error("Chunk load error detected, reloading...", e);
        // Prevent infinite reload loop if the error persists after reload
        const lastReload = sessionStorage.getItem('chunk_reload_time');
        const now = Date.now();
        if (!lastReload || now - parseInt(lastReload) > 10000) {
            sessionStorage.setItem('chunk_reload_time', now.toString());
            window.location.reload();
        }
    }
});

// Also catch unhandled promise rejections for dynamic imports
window.addEventListener('unhandledrejection', (e) => {
    const isChunkError = 
        /Loading chunk [\d]+ failed/.test(e.reason?.message) || 
        /Failed to fetch dynamically imported module/.test(e.reason?.message);
        
    if (isChunkError) {
        console.error("Dynamic import error detected, reloading...", e);
        const lastReload = sessionStorage.getItem('chunk_reload_time');
        const now = Date.now();
        if (!lastReload || now - parseInt(lastReload) > 10000) {
            sessionStorage.setItem('chunk_reload_time', now.toString());
            window.location.reload();
        }
    }
});

createRoot(document.getElementById("root")!).render(<App />);
