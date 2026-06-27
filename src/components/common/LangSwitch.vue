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
      v-for="l in (['zh-CN', 'en-US'] as Locale[])"
      :key="l"
      class="lang-btn"
      :class="{ active: locale === l }"
      @click="switchLanguage(l)"
    >
      {{ l === 'zh-CN' ? '中' : 'EN' }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.lang-switch {
  display: flex;
  border-radius: $radius-xs;
  overflow: hidden;
  background: $bg;
  border: 1px solid $border;
}
.lang-btn {
  padding: 5px 10px;
  border: none;
  background: transparent;
  color: $text-secondary;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.15s;
  &.active { background: $primary; color: #fff; }
  &:not(.active):hover { color: $primary; }
}
</style>
