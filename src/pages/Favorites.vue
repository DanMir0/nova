<script setup>
import {useFavoritesStore} from '../stores/favorites'
import ProductCard from '../components/shop/ProductCard.vue'
import {Heart} from 'lucide-vue-next'
import {onMounted} from "vue";

const favoritesStore = useFavoritesStore()

onMounted(async () => {
  await favoritesStore.loadFavorites()
})
</script>

<template>
  <main class="min-h-screen bg-white">

    <div
        class="mx-auto w-full max-w-[1440px] px-5 pb-20 pt-8 sm:px-8 lg:px-10 xl:px-12">

      <!-- Breadcrumbs -->
      <nav
          class="mb-5 flex items-center gap-2 text-xs text-neutral-400">
        <RouterLink
            to="/"
            class="transition hover:text-black">
          Главная
        </RouterLink>

        <span>/</span>

        <span class="text-neutral-500">
          Избранное
        </span>
      </nav>

      <!-- Header -->
      <header class="mb-8">
        <h1 class="text-3xl font-normal tracking-tight sm:text-4xl">
          Избранное
        </h1>

        <p
            v-if="favoritesStore.favoriteCount"
            class="mt-2 text-sm text-neutral-400">
          {{ favoritesStore.favoriteCount }}
          {{ favoritesStore.favoriteCount === 1 ? 'товар' : 'товара' }}
        </p>
      </header>

      <!-- Empty -->
      <div
          v-if="!favoritesStore.favorites.length"
          class="flex min-h-[400px] flex-col items-center justify-center text-center">
        <Heart
            :size="32"
            :stroke-width="1"
            class="mb-5 text-neutral-400"/>

        <h2 class="text-xl font-normal">
          В избранном пока ничего нет
        </h2>

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

      <!-- Products -->
      <div
          v-else
          class="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        <ProductCard
            v-for="favorite in favoritesStore.favorites"
            :key="favorite.id"
            :product="favorite.products"/>
      </div>

    </div>

  </main>
</template>