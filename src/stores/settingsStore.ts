import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import i18n, { type Locale } from '@/i18n'

type Theme = 'light' | 'dark'

export const useSettingsStore = defineStore('settings', () => {
  const savedLocale = (localStorage.getItem('locale') as Locale) || 'zh-CN'
  const savedTheme = (localStorage.getItem('theme') as Theme) || 'light'

  const locale = ref<Locale>(savedLocale)
  const theme = ref<Theme>(savedTheme)

  i18n.global.locale.value = savedLocale
  document.documentElement.setAttribute('data-theme', savedTheme)

  watch(locale, (val) => {
    localStorage.setItem('locale', val)
    i18n.global.locale.value = val
  })

  watch(theme, (val) => {
    localStorage.setItem('theme', val)
    document.documentElement.setAttribute('data-theme', val)
  })

  function setLocale(value: Locale) {
    locale.value = value
  }

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  return { locale, theme, setLocale, toggleTheme }
})
