<script setup>
import {formatPrice} from "../../utils/formatPrice.js";

defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const handleImageError = (event) => {
  console.error(
      'Не удалось загрузить изображение:',
      event.target.src
  )

  event.target.style.display = 'none'
}
</script>
<template>
  <RouterLink
      :to="`/shop/${product.id}`"
      class="group block">
    <!-- Image -->
    <div class="relative aspect-[3/4] overflow-hidden bg-neutral-100">

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

    </div>
  </RouterLink>
</template>
