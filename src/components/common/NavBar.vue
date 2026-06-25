<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '@/stores/settingsStore'
import LangSwitch from './LangSwitch.vue'

const { t } = useI18n()
const settings = useSettingsStore()

const navItems = [
  { name: 'home', path: '/' },
  { name: 'write', path: '/write' },
  { name: 'history', path: '/history' },
  { name: 'dashboard', path: '/dashboard' },
  { name: 'templates', path: '/templates' }
]
</script>

<template>
  <nav class="navbar">
    <div class="nav-brand">
      <el-icon class="brand-icon"><Document /></el-icon>
      <span class="brand-title">{{ t('app.title') }}</span>
    </div>

    <div class="nav-links">
      <router-link
        v-for="item in navItems"
        :key="item.name"
        :to="item.path"
        class="nav-link"
        active-class="active"
      >
        {{ t(`nav.${item.name}`) }}
      </router-link>
    </div>

    <div class="nav-actions">
      <button class="icon-btn" @click="settings.toggleTheme()">
        <el-icon v-if="settings.theme === 'light'"><Sunny /></el-icon>
        <el-icon v-else><Moon /></el-icon>
      </button>
      <LangSwitch />
    </div>
  </nav>
</template>

<style scoped lang="scss">
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  height: 64px;
  background: var(--bg-card);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  font-size: 1.25rem;
  color: var(--text);

  .brand-icon {
    font-size: 1.5rem;
    color: var(--primary);
  }
}

.nav-links {
  display: flex;
  gap: 8px;
}

.nav-link {
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    color: var(--primary);
    background: var(--bg-soft);
    text-decoration: none;
  }

  &.active {
    color: var(--primary);
    background: rgba(99, 102, 241, 0.1);
  }
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--bg-soft);
  color: var(--text);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--primary);
    color: var(--primary);
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: 0 16px;
  }

  .nav-links {
    display: none;
  }
}
</style>
