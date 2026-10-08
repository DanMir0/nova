<script setup>
import { ArrowRight } from 'lucide-vue-next'

defineProps({
  title: {
    type: String,
    required: true,
  },

  link: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
  },

  imageClass: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <article
      class="group relative min-h-[320px] overflow-hidden rounded-xl bg-neutral-200 sm:min-h-[380px] md:min-h-[430px]
           lg:min-h-[500px]">

    <div
        class="absolute inset-0 bg-gradient-to-br transition-transform duration-700 group-hover:scale-105"
        :class="imageClass"/>

    <img
        :src="image"
        :alt="title"
        class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"/>

    <div
        class="relative z-10 flex h-full flex-col justify-between p-5 sm:p-6 md:p-7 lg:p-8">

      <div>

        <h2
            class="text-2xl font-light tracking-tight sm:text-3xl md:text-3xl lg:text-4xl">
          {{ title }}
        </h2>

        <router-link
            :to="link"
            class="mt-5 inline-flex items-center gap-2 text-xs text-neutral-600 transition-colors
                 hover:text-neutral-950 sm:mt-6 sm:text-sm md:mt-7 lg:mt-8">
          Смотреть всё

          <ArrowRight
              :size="16"
              :stroke-width="1.4"
          />
        </router-link>

      </div>

      <router-link
          :to="link"
          aria-label="Открыть категорию"
          class="ml-auto flex h-11 w-11 items-center justify-center rounded-lg bg-white transition-transform duration-300
               group-hover:translate-x-1 sm:h-12 sm:w-12 md:h-13 md:w-13 lg:h-14 lg:w-14 lg:rounded-xl">
        <ArrowRight
            :size="18"
            :stroke-width="1.4"/>
      </router-link>

    </div>
  </article>
</template>