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
      class="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 xl:grid-cols-4">
    <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"/>
  </div>

  <div
      v-else
      class="py-24 text-center">
    <h2 class="text-xl font-normal">
      Товары не найдены
    </h2>

    <p class="mt-2 text-sm text-neutral-500">
      Попробуйте изменить параметры фильтрации.
    </p>
  </div>
</template>
