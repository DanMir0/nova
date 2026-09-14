<script setup>
import ProductCard from './ProductCard.vue'

defineProps({
    products: {
        type: Array,
        required: true,
    },

    collectionName: {
        type: String,
        default: '',
    },
})
</script>

<template>
    <div v-if="products.length"
         class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">

        <ProductCard
            v-for="product in products"
            :key="product.id"
            :product="product"
            :collection-name="collectionName"/>
    </div>
</template>