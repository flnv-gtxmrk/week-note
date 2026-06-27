<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '@/stores/settingsStore'
import LangSwitch from './LangSwitch.vue'

const { t } = useI18n()
const settings = useSettingsStore()
const route = useRoute()
const sidebarOpen = ref(false)

const navItems = [
  { name: 'home', path: '/', icon: '🏠' },
  { name: 'write', path: '/write', icon: '📝' },
  { name: 'history', path: '/history', icon: '📋' },
  { name: 'dashboard', path: '/dashboard', icon: '📊' },
  { name: 'templates', path: '/templates', icon: '📁' },
  { name: 'settings', path: '/settings', icon: '⚙️' }
]

function isActive(path: string) {
  return route.path === path
}
</script>

<template>
  <!-- Mobile hamburger -->
  <button class="mobile-trigger" @click="sidebarOpen = !sidebarOpen">☰</button>

  <!-- Mobile overlay -->
  <div v-if="sidebarOpen" class="sidebar-overlay" @click="sidebarOpen = false"></div>

  <!-- Sidebar -->
  <aside class="sidebar" :class="{ open: sidebarOpen }">
    <div class="sidebar-brand">
      <div class="brand-logo">W</div>
      <span class="brand-name">{{ t('app.title') }}</span>
    </div>

    <nav class="sidebar-nav">
      <router-link
        v-for="item in navItems"
        :key="item.name"
        :to="item.path"
        class="nav-item"
        :class="{ active: isActive(item.path) }"
        @click="sidebarOpen = false"
      >
        <span class="nav-icon">{{ item.icon }}</span>
        <span class="nav-label">{{ t(`nav.${item.name}`) }}</span>
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <button class="theme-btn" @click="settings.toggleTheme()">
        {{ settings.theme === 'light' ? '🌙' : '☀️' }}
      </button>
      <LangSwitch />
    </div>
  </aside>
</template>

<style scoped lang="scss">
.mobile-trigger {
  display: none;
  position: fixed;
  top: 12px;
  left: 12px;
  z-index: 50;
  background: $bg-card;
  border: 1px solid $border;
  border-radius: $radius-sm;
  padding: 8px 14px;
  font-size: 18px;
  cursor: pointer;
  box-shadow: $shadow;
  color: $text;
}

.sidebar-overlay {
  display: none;
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.25);
  z-index: 45;
}

.sidebar {
  width: $sidebar-w;
  background: $bg-card;
  border-right: 1px solid $border;
  padding: 22px 16px;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 40;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 32px;
  padding: 0 4px;
}

.brand-logo {
  width: 36px; height: 36px;
  border-radius: $radius-sm;
  background: linear-gradient(135deg, $primary, $primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 16px;
  font-weight: 800;
}

.brand-name {
  font-size: 18px;
  font-weight: 800;
  color: $text;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: $radius-sm;
  color: $text-secondary;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.15s;

  &:hover {
    background: $primary-lighter;
    color: $primary;
  }

  &.active {
    background: $primary-lighter;
    color: $primary;
    font-weight: 600;
  }
}

.nav-icon {
  font-size: 16px;
  width: 20px;
  text-align: center;
}

.sidebar-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid $border;
}

.theme-btn {
  width: 34px; height: 34px;
  border-radius: $radius-sm;
  border: 1px solid $border;
  background: $bg;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

@media (max-width: 768px) {
  .mobile-trigger { display: block; }
  .sidebar-overlay.open, .sidebar.open ~ .sidebar-overlay { display: block; }
  .sidebar {
    left: -240px;
    transition: left 0.25s ease;
    &.open { left: 0; }
  }
}
</style>
