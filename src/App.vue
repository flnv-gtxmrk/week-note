<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from '@/components/common/NavBar.vue'
import FooterBar from '@/components/common/FooterBar.vue'
import ParticleBackground from '@/components/common/ParticleBackground.vue'

const route = useRoute()

const showBackground = computed(() => route.name === 'home')
</script>

<template>
  <ParticleBackground v-if="showBackground" />
  <NavBar />
  <main class="main-content">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
  <FooterBar />
</template>

<style scoped lang="scss">
.main-content {
  flex: 1;
  position: relative;
  z-index: 1;
}
</style>
