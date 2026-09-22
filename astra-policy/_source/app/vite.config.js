import {defineConfig} from 'vite';
export default defineConfig({base:'./', publicDir:false, build:{outDir:process.env.REPORT_OUT_DIR||'../..', emptyOutDir:false, assetsDir:'report-assets'}});
