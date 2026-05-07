import { reactive } from 'vue'

const THEME_KEY = 'konfigme-theme'

function getSavedTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || 'dark'
  } catch {
    return 'dark'
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch { /* ignore */ }
}

export const appStore = reactive({
  mode: 'template',
  theme: getSavedTheme(),
})

// Apply on load
applyTheme(appStore.theme)

export function toggleTheme() {
  appStore.theme = appStore.theme === 'dark' ? 'light' : 'dark'
  applyTheme(appStore.theme)
}
