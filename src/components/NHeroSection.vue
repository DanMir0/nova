<script setup>
import {ArrowLeft, ArrowRight,} from 'lucide-vue-next'
import {ref, computed} from 'vue'
import hero1 from '/images/hero/hero-1.png'
import hero2 from '/images/hero/hero-2.png'
import hero3 from '/images/hero/hero-3.png'

const currentSlide = ref(0)
const slides = [
  {
    image: hero1,
    subtitle: 'НОВАЯ КОЛЛЕКЦИЯ',
    title: 'Весна / Лето 2026',
    description: 'Лёгкость, стиль и комфорт в каждой детали.',
    buttonText: 'Смотреть коллекцию',
    buttonLink: '/collections',
  },

  {
    image: hero2,
    subtitle: 'НОВАЯ КОЛЛЕКЦИЯ',
    title: 'Осень / Зима 2026',
    description: 'Новые материалы, силуэты и характер.',
    buttonText: 'Смотреть коллекцию',
    buttonLink: '/collections',
  },

  {
    image: hero3,
    subtitle: 'НОВИНКИ',
    title: 'Новая глава Nova',
    description: 'Современный гардероб на каждый день.',
    buttonText: 'Смотреть новинки',
    buttonLink: '/shop?collection=new',
  },
]

const currentSlideData = computed(() => {
  return slides[currentSlide.value]
})

function nextSlide() {
  currentSlide.value =
      (currentSlide.value + 1) % slides.length
}

function previousSlide() {
  currentSlide.value =
      (currentSlide.value - 1 + slides.length) % slides.length
}
</script>

<template>
  <section
      class="relative min-h-[680px] overflow-hidden bg-[#eeeae5] sm:min-h-[720px] lg:min-h-[760px]">
    <!-- Background image -->
    <Transition name="hero-image" mode="out-in">
      <img
          :key="currentSlideData.image"
          :src="currentSlideData.image"
          :alt="currentSlideData.title"
          class="absolute inset-0 h-full w-full object-cover object-[65%_center] lg:object-center"
      />
    </Transition>

    <!-- Light overlay for text readability -->
    <div
        class="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent lg:w-[65%]"/>

    <!-- Content -->
    <div
        class="relative z-10 mx-auto flex min-h-[680px] max-w-[1440px] items-end px-6 pb-16 pt-32 sm:min-h-[720px] sm:pb-20 lg:min-h-[760px] lg:items-center lg:px-10 lg:pb-0">
      <div class="max-w-xl">
        <p
            class="mb-6 text-xs uppercase tracking-[0.08em] text-neutral-700 sm:text-sm">
          {{ currentSlideData.subtitle }}
        </p>

        <h1
            class="max-w-lg text-5xl font-light leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-[76px]">
          {{ currentSlideData.title }}
        </h1>

        <p
            class="mt-7 max-w-sm text-sm leading-6 text-neutral-500 sm:text-base sm:leading-7">
          {{ currentSlideData.description }}
        </p>

        <router-link
            :to="currentSlideData.buttonLink"
            class="mt-8 inline-flex items-center justify-center rounded-md bg-neutral-950 px-7 py-4 text-sm text-white transition hover:bg-neutral-800">
          {{ currentSlideData.buttonText }}
        </router-link>

        <!-- Slider controls -->
        <div class="mt-10 flex items-center gap-4 sm:mt-12">
          <span class="text-sm">
            {{ String(currentSlide + 1).padStart(2, '0') }}
          </span>

          <div class="h-px w-12 bg-neutral-400 sm:w-16"/>

          <span class="text-sm text-neutral-400">
            {{ String(slides.length).padStart(2, '0') }}
          </span>

          <button
              type="button"
              aria-label="Предыдущий слайд"
              class="ml-3 flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 transition hover:border-neutral-950"
              @click="previousSlide">
            <ArrowLeft
                :size="17"
                :stroke-width="1.4"/>
          </button>

          <button
              type="button"
              aria-label="Следующий слайд"
              class="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-950 transition hover:bg-neutral-950 hover:text-white"
              @click="nextSlide">
            <ArrowRight
                :size="17"
                :stroke-width="1.4"/>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-image-enter-active,
.hero-image-leave-active {
  transition: opacity 0.5s ease;
}

.hero-image-enter-from,
.hero-image-leave-to {
  opacity: 0;
}
</style>