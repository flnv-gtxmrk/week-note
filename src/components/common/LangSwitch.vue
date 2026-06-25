<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '@/stores/settingsStore'
import type { Locale } from '@/i18n'

const { locale } = useI18n()
const settings = useSettingsStore()

function switchLanguage(value: Locale) {
  locale.value = value
  settings.setLocale(value)
}
</script>

<template>
  <div class="lang-switch">
    <button
      v-for="l in ['zh-CN', 'en-US']"
      :key="l"
      class="lang-btn"
      :class="{ active: locale === l }"
      @click="switchLanguage(l as Locale)"
    >
      {{ l === 'zh-CN' ? '中' : 'EN' }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.lang-switch {
  display: flex;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--bg-soft);
}

.lang-btn {
  padding: 6px 12px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;

  &.active {
    background: var(--primary);
    color: white;
  }

  &:not(.active):hover {
    color: var(--primary);
  }
}
</style>
