<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import gsap from 'gsap'

const { t } = useI18n()
const router = useRouter()

onMounted(() => {
  gsap.from('.hero-title', { opacity: 0, y: 30, duration: 0.7, ease: 'power3.out' })
  gsap.from('.hero-subtitle', { opacity: 0, y: 20, duration: 0.7, delay: 0.15, ease: 'power3.out' })
  gsap.from('.hero-btn', { opacity: 0, scale: 0.95, duration: 0.5, delay: 0.3, ease: 'back.out(1.7)' })
  gsap.from('.feature-card', { opacity: 0, y: 30, duration: 0.6, stagger: 0.12, delay: 0.5, ease: 'power3.out' })
})
</script>

<template>
  <div class="home">
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">{{ t('home.heroTitle') }}</h1>
        <p class="hero-subtitle">{{ t('home.heroSubtitle') }}</p>
        <button class="hero-btn" @click="router.push('/write')">
          {{ t('home.startBtn') }} →
        </button>
      </div>
    </section>

    <section class="features">
      <div class="feature-card card">
        <div class="feature-icon">✨</div>
        <h3>{{ t('home.feature1Title') }}</h3>
        <p>{{ t('home.feature1Desc') }}</p>
      </div>
      <div class="feature-card card">
        <div class="feature-icon">📋</div>
        <h3>{{ t('home.feature2Title') }}</h3>
        <p>{{ t('home.feature2Desc') }}</p>
      </div>
      <div class="feature-card card">
        <div class="feature-icon">📊</div>
        <h3>{{ t('home.feature3Title') }}</h3>
        <p>{{ t('home.feature3Desc') }}</p>
      </div>
    </section>

    <section class="how-it-works card">
      <h2 class="section-title">{{ t('home.howTitle') }}</h2>
      <div class="steps">
        <div class="step">
          <div class="step-number">1</div>
          <p>{{ t('home.step1') }}</p>
        </div>
        <div class="step-arrow">→</div>
        <div class="step">
          <div class="step-number">2</div>
          <p>{{ t('home.step2') }}</p>
        </div>
        <div class="step-arrow">→</div>
        <div class="step">
          <div class="step-number">3</div>
          <p>{{ t('home.step3') }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.home {
  max-width: 760px;
  margin: 0 auto;
  padding: 60px 28px;
}

.hero {
  text-align: center;
  margin-bottom: 48px;
}

.hero-content {
  max-width: 600px;
  margin: 0 auto;
}

.hero-title {
  font-size: 40px;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 16px;
  background: linear-gradient(135deg, $primary, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 16px;
  color: $text-secondary;
  margin-bottom: 28px;
  line-height: 1.6;
}

.hero-btn {
  padding: 12px 32px;
  font-size: 15px;
  font-weight: 600;
  border-radius: $radius-round;
  border: none;
  background: $primary;
  color: #fff;
  cursor: pointer;
  transition: all 0.15s;
  &:hover { background: $primary-dark; transform: translateY(-1px); }
}

.features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.feature-card {
  padding: 28px 22px;
  text-align: center;
  transition: all 0.2s;
  &:hover { transform: translateY(-4px); box-shadow: $shadow-md; }
  h3 { margin: 12px 0 8px; font-size: 16px; font-weight: 700; }
  p { color: $text-secondary; font-size: 14px; line-height: 1.5; }
}

.feature-icon { font-size: 32px; }

.how-it-works {
  padding: 32px 40px;
}

.steps {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.step { text-align: center; p { color: $text-secondary; font-size: 14px; margin-top: 8px; } }
.step-arrow { color: $text-tertiary; font-size: 20px; }

.step-number {
  width: 48px; height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, $primary, $primary-light);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 800;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .hero-title { font-size: 28px; }
  .features { grid-template-columns: 1fr; }
  .step-arrow { display: none; }
}
</style>
