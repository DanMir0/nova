<script setup>
import {ArrowRight} from 'lucide-vue-next'

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
      class="group relative min-h-[300px] overflow-hidden rounded-xl bg-neutral-200 sm:min-h-[360px]">
    <!-- Image placeholder -->
    <div
        class="absolute inset-0 bg-gradient-to-br transition-transform duration-700 group-hover:scale-105"
        :class="imageClass"/>
    <img
        :src="image"
        :alt="title"
        class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
    />


    <div class="relative z-10 flex h-full flex-col justify-between p-8">
      <div>
        <h2
            class="text-3xl font-light tracking-tight">
          {{ title }}
        </h2>

        <router-link
            :to="link"
            class="mt-8 inline-flex items-center gap-2 text-sm text-neutral-600 transition-colors hover:text-neutral-950">
          Смотреть всё

          <ArrowRight
              :size="17"
              :stroke-width="1.4"/>
        </router-link>
      </div>

      <router-link
          :to="link"
          aria-label="Открыть категорию"
          class="ml-auto flex h-14 w-14 items-center justify-center rounded-xl bg-white transition-transform
          duration-300 group-hover:translate-x-1">
        <ArrowRight
            :size="21"
            :stroke-width="1.4"/>
      </router-link>
    </div>
  </article>
</template>
