<script setup lang="ts">
import NavBar from '@/components/common/NavBar.vue'
</script>

<template>
  <NavBar />
  <div class="app-main">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style scoped lang="scss">
.app-main {
  margin-left: $sidebar-w;
  flex: 1;
  min-height: 100vh;
}

@media (max-width: 768px) {
  .app-main { margin-left: 0; padding-top: 52px; }
}
</style>
