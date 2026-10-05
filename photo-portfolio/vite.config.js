import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ============================================================
// GITHUB PAGES SETUP — one thing to change before deploying:
// ============================================================
// Replace 'your-repo-name' below with the EXACT name of the GitHub repo
// you create for this project (case-sensitive). e.g. if your repo is
// github.com/nithinkv/photo-portfolio, set base to '/photo-portfolio/'.
//
// This has to match or your deployed site will load with broken CSS
// and missing images (the #1 GitHub Pages + Vite gotcha).
// ============================================================
export default defineConfig({
  plugins: [react()],
base: '/vnkPhotography/',
  server: {
    // Needed for tunneling tools like localtunnel/ngrok — Vite blocks
    // unrecognized hostnames by default as a security measure.
    // Add your tunnel's exact host here, or use true to allow any host
    // (fine for local dev, not something you'd ship to production).
    allowedHosts: ['sharp-swans-fail.loca.lt'],
  },
})