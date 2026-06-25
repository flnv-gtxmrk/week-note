import { defineStore } from 'pinia'
import { ref, watch, onMounted } from 'vue'
import i18n, { type Locale } from '@/i18n'

type Theme = 'light' | 'dark'

export const useSettingsStore = defineStore('settings', () => {
  const locale = ref<Locale>('zh-CN')
  const theme = ref<Theme>('light')

  onMounted(() => {
    locale.value = (localStorage.getItem('locale') as Locale) || 'zh-CN'
    theme.value = (localStorage.getItem('theme') as Theme) || 'light'
    i18n.global.locale.value = locale.value
    applyTheme(theme.value)
  })

  watch(locale, (val) => {
    localStorage.setItem('locale', val)
  })

  watch(theme, (val) => {
    localStorage.setItem('theme', val)
    applyTheme(val)
  })

  function applyTheme(value: Theme) {
    document.documentElement.setAttribute('data-theme', value)
  }

  function setLocale(value: Locale) {
    locale.value = value
    i18n.global.locale.value = value
  }

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  return { locale, theme, setLocale, toggleTheme }
})
