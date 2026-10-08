<script setup>
import { ArrowLeft, ArrowRight } from 'lucide-vue-next'
import { ref, computed } from 'vue'
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
    buttonLink: '/collections/spring-summer',
  },

  {
    image: hero2,
    subtitle: 'НОВАЯ КОЛЛЕКЦИЯ',
    title: 'Осень / Зима 2026',
    description: 'Новые материалы, силуэты и характер.',
    buttonText: 'Смотреть коллекцию',
    buttonLink: '/collections/autumn-winter',
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
      class="relative min-h-[620px] overflow-hidden bg-[#eeeae5]
           sm:min-h-[680px]
           md:min-h-[700px]
           lg:min-h-[760px]">

    <Transition name="hero-image" mode="out-in">
      <img
          :key="currentSlideData.image"
          :src="currentSlideData.image"
          :alt="currentSlideData.title"
          class="absolute inset-0 h-full w-full object-cover
               object-[68%_center]
               sm:object-[65%_center]
               md:object-[65%_center]
               lg:object-center"/>
    </Transition>

    <div
        class="absolute inset-0
             bg-gradient-to-r
             from-white via-white/90 to-white/10
             sm:via-white/85
             md:via-white/80
             lg:w-[65%]"/>

    <div
        class="relative z-10 mx-auto flex min-h-[620px] max-w-[1440px]
             items-end
             px-5 pb-12 pt-28
             sm:min-h-[680px] sm:px-6 sm:pb-16
             md:min-h-[700px] md:px-8 md:pb-16
             lg:min-h-[760px] lg:items-center lg:px-10 lg:pb-0">

      <div
          class="w-full max-w-xl
               md:max-w-2xl
               lg:max-w-xl">

        <p class="mb-4 text-[11px] uppercase tracking-[0.08em] text-neutral-700
                 sm:mb-5 sm:text-xs
                 md:text-sm
                 lg:mb-6">
          {{ currentSlideData.subtitle }}
        </p>

        <h1
            class="max-w-[330px]
                 text-4xl font-light leading-[0.98]
                 tracking-[-0.04em]
                 sm:max-w-md sm:text-5xl
                 md:max-w-lg md:text-6xl
                 lg:text-[76px]">
          {{ currentSlideData.title }}
        </h1>

        <p
            class="mt-5 max-w-[300px]
                 text-sm leading-5 text-neutral-500
                 sm:mt-6 sm:max-w-sm sm:text-base sm:leading-6
                 md:mt-7 md:leading-7
                 lg:mt-7">
          {{ currentSlideData.description }}
        </p>

        <router-link
            :to="currentSlideData.buttonLink"
            class="mt-6 inline-flex items-center justify-center
                 rounded-md bg-neutral-950
                 px-5 py-3
                 text-xs text-white
                 transition hover:bg-neutral-800
                 sm:mt-7 sm:px-6 sm:py-3.5 sm:text-sm
                 md:mt-8 md:px-7 md:py-4">
          {{ currentSlideData.buttonText }}
        </router-link>

        <div class="mt-8 flex items-center gap-3
                 sm:mt-10 sm:gap-4
                 md:mt-12">

          <span class="text-xs sm:text-sm">
            {{ String(currentSlide + 1).padStart(2, '0') }}
          </span>

          <div class="h-px w-8 bg-neutral-400
                   sm:w-12
                   md:w-16"/>

          <span class="text-xs text-neutral-400 sm:text-sm">
            {{ String(slides.length).padStart(2, '0') }}
          </span>

          <button
              type="button"
              aria-label="Предыдущий слайд"
              class="ml-1 flex h-9 w-9 cursor-pointer items-center justify-center
                   rounded-full border border-neutral-300
                   transition hover:border-neutral-950
                   sm:ml-2 sm:h-10 sm:w-10"
              @click="previousSlide">
            <ArrowLeft
                :size="16"
                :stroke-width="1.4"/>
          </button>

          <button
              type="button"
              aria-label="Следующий слайд"
              class="flex h-9 w-9 cursor-pointer items-center justify-center
                   rounded-full border border-neutral-950
                   transition hover:bg-neutral-950 hover:text-white
                   sm:h-10 sm:w-10"
              @click="nextSlide">
            <ArrowRight
                :size="16"
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