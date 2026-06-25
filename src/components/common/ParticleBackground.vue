<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let particles: Particle[] = []
let animationId = 0

class Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string

  constructor(w: number, h: number) {
    this.x = Math.random() * w
    this.y = Math.random() * h
    this.vx = (Math.random() - 0.5) * 0.5
    this.vy = (Math.random() - 0.5) * 0.5
    this.radius = Math.random() * 2 + 1
    this.color = `rgba(99, 102, 241, ${Math.random() * 0.3 + 0.1})`
  }

  update(w: number, h: number) {
    this.x += this.vx
    this.y += this.vy

    if (this.x < 0 || this.x > w) this.vx *= -1
    if (this.y < 0 || this.y > h) this.vy *= -1
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = this.color
    ctx.fill()
  }
}

function initParticles() {
  if (!canvas.value) return
  const w = canvas.value.width
  const h = canvas.value.height
  particles = []
  const count = Math.min(80, Math.floor((w * h) / 15000))
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(w, h))
  }
}

function resize() {
  if (!canvas.value) return
  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight
  initParticles()
}

function animate() {
  if (!ctx || !canvas.value) return
  const w = canvas.value.width
  const h = canvas.value.height

  ctx.clearRect(0, 0, w, h)

  for (const p of particles) {
    p.update(w, h)
    p.draw(ctx)
  }

  // Draw connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x
      const dy = particles[i].y - particles[j].y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 120) {
        ctx.beginPath()
        ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - dist / 120)})`
        ctx.lineWidth = 0.5
        ctx.moveTo(particles[i].x, particles[i].y)
        ctx.lineTo(particles[j].x, particles[j].y)
        ctx.stroke()
      }
    }
  }

  animationId = requestAnimationFrame(animate)
}

onMounted(() => {
  if (!canvas.value) return
  ctx = canvas.value.getContext('2d')
  resize()
  window.addEventListener('resize', resize)
  animate()
})

onUnmounted(() => {
  window.removeEventListener('resize', resize)
  cancelAnimationFrame(animationId)
})
</script>

<template>
  <canvas ref="canvas" class="particle-bg"></canvas>
</template>

<style scoped lang="scss">
.particle-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  background: linear-gradient(135deg, var(--bg) 0%, var(--bg-soft) 100%);
}
</style>
