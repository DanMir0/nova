<script setup>
import ProductCard from './ProductCard.vue'

defineProps({
  products: {
    type: Array,
    default: () => [],
  },
})
</script>
<template>
  <div
      v-if="products.length"
      class="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
    <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"/>
  </div>

  <div
      v-else
      class="py-24 text-center">
    <h2 class="text-2xl font-light">
      Товары не найдены
    </h2>

    <p class="mt-3 text-sm text-neutral-500">
      Попробуйте изменить параметры поиска.
    </p>
  </div>
</template>
