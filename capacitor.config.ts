import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.panaderiacostos.app',
  appName: 'panadería-costos-pro',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
