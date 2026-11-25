import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({plugins:[react()],base:'/',build:{outDir:'dist-admin',emptyOutDir:true,rollupOptions:{input:'admin.html'}},publicDir:false})
