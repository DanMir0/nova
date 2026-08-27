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
  <article class="group min-w-0">

    <!-- Image -->
    <div class="relative aspect-[3/4] overflow-hidden bg-neutral-100">

      <img
          v-if="product.image_url"
          :src="product.image_url"
          :alt="product.name"
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"/>

      <!-- Badge -->
      <span
          v-if="product.is_new"
          class="absolute left-2 top-2 rounded-full bg-white px-3 py-1 text-[10px] font-medium">
        Новинка
      </span>

      <span
          v-if="product.is_sale"
          class="absolute left-2 top-2 rounded-full bg-[#f4d8b5] px-3 py-1 text-[10px] font-medium">
        Хит
      </span>

      <!-- Favorite -->
      <button
          type="button"
          class="absolute right-3 top-3 flex h-8 w-8 items-center justify-center text-neutral-700 transition hover:scale-110"
          aria-label="Добавить в избранное">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5">
          <path
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"/>
        </svg>
      </button>

    </div>

    <!-- Product info -->
    <div class="mt-3">

      <h2 class="truncate text-sm font-normal">
        {{ product.name }}
      </h2>

      <div class="mt-1 flex items-center gap-2">

        <span class="text-sm font-medium">
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
