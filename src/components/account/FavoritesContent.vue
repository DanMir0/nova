<script setup>
import {onMounted} from 'vue'
import {Heart} from 'lucide-vue-next'
import ProductCard from '../shop/ProductCard.vue'
import {useFavoritesStore} from '../../stores/favorites'

const favoritesStore = useFavoritesStore()

onMounted(async () => {
    await favoritesStore.loadFavorites()
})
</script>

<template>
    <div>
        <p
                v-if="favoritesStore.favoriteCount"
                class="mb-6 text-sm text-neutral-400">
            {{ favoritesStore.favoriteCount }}
            {{ favoritesStore.favoriteCount === 1 ? 'товар' : 'товара' }}
        </p>

        <div
                v-if="!favoritesStore.favorites.length"
                class="flex min-h-[400px] flex-col items-center justify-center text-center">
            <Heart
                    :size="32"
                    :stroke-width="1"
                    class="mb-5 text-neutral-400"
            />
            <h3 class="text-xl font-normal">
                В избранном пока ничего нет
            </h3>

            <p class="mt-3 max-w-sm text-sm leading-6 text-neutral-500">
                Добавляйте понравившиеся товары в избранное,
                чтобы не потерять их.
            </p>

            <RouterLink
                    to="/shop"
                    class="mt-7 bg-black px-7 py-3.5 text-sm text-white transition hover:bg-neutral-800">
                Перейти в магазин
            </RouterLink>
        </div>

        <div
                v-else
                class="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            <ProductCard
                    v-for="favorite in favoritesStore.favorites"
                    :key="favorite.id"
                    :product="favorite.products"/>
        </div>
    </div>
</template>