<script setup>
import { Heart } from 'lucide-vue-next'
import { formatPrice } from '../../utils/formatPrice.js'
import { useFavoritesStore } from '../../stores/favorites'
import { useAuthStore } from '../../stores/auth'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits([
  'login',
])

const favoritesStore = useFavoritesStore()
const authStore = useAuthStore()

const toggleFavorite = async (event) => {
  event.preventDefault()
  event.stopPropagation()

  if (!authStore.user) {
    emit('login')
    return
  }

  await favoritesStore.toggleFavorite(props.product.id)
}
</script>

<template>
  <RouterLink
      :to="`/shop/${product.id}`"
      class="group block">

    <!-- Image -->
    <div
        class="relative aspect-[3/4] overflow-hidden bg-neutral-100">

      <img
          v-if="product.images?.length"
          :src="product.images[0]"
          :alt="product.name"
          class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"/>

      <img
          v-else-if="product.image_url"
          :src="product.image_url"
          :alt="product.name"
          class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"/>

      <div
          v-else
          class="flex h-full items-center justify-center text-sm text-neutral-400">
        Нет изображения
      </div>

      <!-- Favorite -->
      <button
          type="button"
          aria-label="Добавить в избранное"
          class="absolute right-3 top-3 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/90 transition hover:bg-white"
          @click="toggleFavorite">

        <Heart
            :size="18"
            :stroke-width="1.5"
            :fill="favoritesStore.isFavorite(product.id) ? 'currentColor' : 'none'"
            :class="
            favoritesStore.isFavorite(product.id) ? 'text-black' : 'text-black'"/>

      </button>

      <!-- Sale -->
      <span
          v-if="product.is_sale"
          class="absolute left-3 top-3 bg-black px-2 py-1 text-[10px] uppercase tracking-wider text-white">
        Sale
      </span>

      <!-- New -->
      <span
          v-else-if="product.is_new"
          class="absolute left-3 top-3 bg-white px-2 py-1 text-[10px] uppercase tracking-wider text-black">
        New
      </span>

    </div>

    <!-- Info -->
    <div class="pt-4">

      <h2 class="text-sm font-normal">
        {{ product.name }}
      </h2>

      <div class="mt-2 text-sm">
        {{ formatPrice(product.price) }}
      </div>

      <!-- Colors -->
      <div
          v-if="product.colors?.length"
          class="mt-3 flex items-center gap-1.5">

        <span
            v-for="color in product.colors"
            :key="color"
            class="h-3.5 w-3.5 rounded-full border border-neutral-300"
            :class="{
            'bg-black': color === 'black',
            'bg-white': color === 'white',
            'bg-[#d8d0c4]': color === 'beige',
            'bg-[#8b7967]': color === 'brown',
            'bg-[#9b9b9b]': color === 'grey',
            'bg-[#f2c06b]': color === 'yellow',
            'bg-[#4f6d8a]': color === 'blue',}"/>

      </div>

    </div>

  </RouterLink>
</template>