<script setup>
import { Heart } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

import { formatPrice } from '../../utils/formatPrice'

defineProps({
    product: {
        type: Object,
        required: true,
    },

    collectionName: {
        type: String,
        default: '',
    },
})

const getProductImage = (product) => {
    if (product.images?.length) {
        return product.images[0]
    }

    return product.image_url || ''
}

const colorMap = {
    beige: '#d8d0c4',
    brown: '#8b7967',
    black: '#111111',
    white: '#eeeeee',
    yellow: '#FFFF00',
    grey: '#9b9b9b',
    blue: '#4f6d8a',
    green: '#8da37b',
}

const getProductColors = (product) => {
    if (Array.isArray(product.colors)) {
        return product.colors
    }

    if (product.color) {
        return [product.color]
    }

    return []
}

const getColorHex = (color) => {
    return colorMap[color] || '#e5e5e5'
}
</script>

<template>
    <article class="group min-w-0">

        <!-- IMAGE -->
        <RouterLink
            :to="`/shop/${product.id}`"
            class="relative block overflow-hidden bg-neutral-100">
            <div class="aspect-[3/4]">
                <img
                    :src="getProductImage(product)"
                    :alt="product.name"
                    class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"/>
            </div>

            <!-- COLLECTION / NEW -->
            <span
                v-if="collectionName"
                class="absolute left-2 top-2 bg-[#e6efd8] px-2 py-1 text-[10px] text-neutral-700">
                {{ collectionName }}
            </span>

            <span
                v-else-if="product.is_new"
                class="absolute left-2 top-2 bg-[#e6efd8] px-2 py-1 text-[10px] text-neutral-700">
                Новинка
            </span>

            <!-- SALE -->
            <span
                v-if="product.is_sale"
                class="absolute left-2 top-9 bg-rose-500 px-2 py-1 text-[10px] text-white">
                Sale
            </span>

            <!-- FAVORITE -->
            <button
                type="button"
                class="absolute right-2 top-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/90 transition hover:bg-white"
                aria-label="Добавить в избранное"
                @click.prevent.stop>
                <Heart :size="16" />
            </button>
        </RouterLink>

        <!-- INFO -->
        <div class="mt-3">

            <RouterLink
                :to="`/shop/${product.id}`"
                class="block text-xs font-medium leading-5 transition hover:text-neutral-500">
                {{ product.name }}
            </RouterLink>

            <div class="mt-1 text-xs text-neutral-500">
                Nova
            </div>

            <div class="mt-2 flex items-center gap-2">
                <span :class="product.old_price ? 'font-medium text-rose-500' : 'font-medium text-black'">
                    {{ formatPrice(product.price) }}
                </span>

                <span
                    v-if="product.old_price"
                    class="text-xs text-neutral-400 line-through">
                    {{ formatPrice(product.old_price) }}
                </span>
            </div>

            <!-- COLORS -->
            <div
                v-if="getProductColors(product).length"
                class="mt-3 flex gap-1.5">
                <span
                    v-for="color in getProductColors(product)"
                    :key="color"
                    class="h-3.5 w-3.5 rounded-full border border-neutral-200"
                    :style="{ backgroundColor: getColorHex(color), }"/>
            </div>

        </div>
    </article>
</template>