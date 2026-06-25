<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <p class="footer-text">
      © {{ year }} {{ t('app.title') }} · Built with Vue 3 + Java + TeaVM
    </p>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  padding: 24px;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.875rem;
  border-top: 1px solid var(--border);
  background: var(--bg-card);
  backdrop-filter: blur(12px);
}

.footer-text {
  margin: 0;
}
</style>
