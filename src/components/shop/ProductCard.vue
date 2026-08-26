<script setup>
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
  <article class="group">
    <!-- Image -->
    <div
        class="relative aspect-[3/4] overflow-hidden bg-neutral-100">
      <img
          v-if="product.image_url"
          :src="product.image_url"
          :alt="product.name"
          class="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          @error="handleImageError"/>

      <div
          v-else
          class="flex h-full w-full items-center justify-center text-sm text-neutral-400">
        Nova
      </div>

      <!-- New -->
      <span
          v-if="product.is_new"
          class="absolute left-3 top-3 bg-white px-3 py-1 text-[10px] uppercase tracking-wide">
        New
      </span>

      <!-- Sale -->
      <span
          v-if="product.is_sale"
          class="absolute right-3 top-3 bg-black px-3 py-1 text-[10px] uppercase tracking-wide text-white">
        Sale
      </span>
    </div>

    <!-- Info -->
    <div class="mt-4">
      <h2 class="text-sm">
        {{ product.name }}
      </h2>

      <p
          v-if="product.category"
          class="mt-1 text-xs capitalize text-neutral-400">
        {{ product.category }}
      </p>

      <div class="mt-2 flex items-center gap-2">
        <span class="text-sm">
          {{ product.price }} €
        </span>

        <span
            v-if="product.old_price"
            class="text-sm text-neutral-400 line-through">
          {{ product.old_price }} €
        </span>
      </div>
    </div>
  </article>
</template>
