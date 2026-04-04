import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.quitanow.trancut',
  appName: 'TranCut',
  webDir: 'out',
  server: {
    url: 'https://trancut-web.vercel.app',
    cleartext: false,
  },
};

export default config;
