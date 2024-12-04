import { defineConfig } from 'wxt';
import autoprefixer from 'autoprefixer'
import tailwind from 'tailwindcss'

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-vue'],
  vite: () => ({
    css: {
      postcss: {
        plugins: [tailwind(), autoprefixer()],
      },
    },
  }),
  manifest: {
    manifest_version: 3,
    name: "AI Management Assistant",
    version: "1.0",
    description: "AI powered management assistant",
    permissions: [
      "sidePanel",
      "storage",
      "unlimitedStorage",
      "tabs",
      "activeTab",
      'scripting',
      'readingList',
      'alarms',
      'notifications',
      'history',
    ],
    host_permissions: [
      '<all_urls>'
    ],
    action: {
      default_title: 'AI Assistant',
    }
  },
});
