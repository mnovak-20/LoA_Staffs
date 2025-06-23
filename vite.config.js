import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/LoA_Staffs/', // 🔁 Replace with your actual GitHub repo name
  plugins: [react()],
});
