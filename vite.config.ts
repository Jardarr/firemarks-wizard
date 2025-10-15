import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { copyPublicDir } from './plugins/copyPublicDir';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss(), copyPublicDir()],
    publicDir: "public",
    build: {
        rollupOptions: {
            input: {
                main: 'index.html'
            }
        }
    }
});
