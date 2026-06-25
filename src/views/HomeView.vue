<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import gsap from 'gsap'

const { t } = useI18n()
const router = useRouter()

onMounted(() => {
  gsap.from('.hero-title', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' })
  gsap.from('.hero-subtitle', { opacity: 0, y: 20, duration: 0.8, delay: 0.2, ease: 'power3.out' })
  gsap.from('.hero-btn', { opacity: 0, scale: 0.9, duration: 0.6, delay: 0.4, ease: 'back.out(1.7)' })
  gsap.from('.feature-card', {
    opacity: 0,
    y: 40,
    duration: 0.7,
    stagger: 0.15,
    delay: 0.6,
    ease: 'power3.out'
  })
  gsap.from('.step', {
    opacity: 0,
    y: 30,
    duration: 0.6,
    stagger: 0.12,
    delay: 1,
    ease: 'power3.out'
  })
})
</script>

<template>
  <div class="home">
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">{{ t('home.heroTitle') }}</h1>
        <p class="hero-subtitle">{{ t('home.heroSubtitle') }}</p>
        <el-button
          type="primary"
          size="large"
          class="hero-btn animate-pulse-glow"
          @click="router.push('/write')"
        >
          {{ t('home.startBtn') }}
        </el-button>
      </div>
    </section>

    <section class="features">
      <div class="feature-card glass-card">
        <div class="feature-icon"><el-icon><MagicStick /></el-icon></div>
        <h3>{{ t('home.feature1Title') }}</h3>
        <p>{{ t('home.feature1Desc') }}</p>
      </div>
      <div class="feature-card glass-card">
        <div class="feature-icon"><el-icon><Collection /></el-icon></div>
        <h3>{{ t('home.feature2Title') }}</h3>
        <p>{{ t('home.feature2Desc') }}</p>
      </div>
      <div class="feature-card glass-card">
        <div class="feature-icon"><el-icon><DataLine /></el-icon></div>
        <h3>{{ t('home.feature3Title') }}</h3>
        <p>{{ t('home.feature3Desc') }}</p>
      </div>
    </section>

    <section class="how-it-works glass-card">
      <h2 class="section-title">{{ t('home.howTitle') }}</h2>
      <div class="steps">
        <div class="step">
          <div class="step-number">1</div>
          <p>{{ t('home.step1') }}</p>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <p>{{ t('home.step2') }}</p>
        </div>
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
  padding: 48px 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.hero {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.hero-content {
  max-width: 720px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 20px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: 32px;
  line-height: 1.7;
}

.hero-btn {
  padding: 16px 40px;
  font-size: 1.125rem;
  border-radius: 999px;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin: 48px 0;
}

.feature-card {
  padding: 32px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(99, 102, 241, 0.12);
  }

  h3 {
    margin: 16px 0 8px;
    font-size: 1.25rem;
  }

  p {
    color: var(--text-secondary);
    line-height: 1.6;
  }
}

.feature-icon {
  font-size: 2.5rem;
  color: var(--primary);
}

.how-it-works {
  padding: 40px;
  margin-bottom: 48px;
}

.steps {
  display: flex;
  justify-content: space-around;
  gap: 24px;
  flex-wrap: wrap;
}

.step {
  text-align: center;
  flex: 1;
  min-width: 160px;

  p {
    color: var(--text-secondary);
    font-size: 1rem;
  }
}

.step-number {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 auto 16px;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.25rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }
}
</style>
