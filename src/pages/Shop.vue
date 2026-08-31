<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import router from "../router/index.js";
import { useProductsStore } from '../stores/products'

import ProductFilters from '../components/shop/ProductFilters.vue'
import ProductGrid from '../components/shop/ProductGrid.vue'
import ProductGridLoader from '../components/shop/ProductGridLoader.vue'
import ProductToolbar from '../components/shop/ProductToolbar.vue'

const route = useRoute()
const productsStore = useProductsStore()

const mobileFiltersOpen = ref(false)

const categoryLabels = {
  't-shirts': 'Футболки',
  shirts: 'Рубашки',
  jackets: 'Жакеты и куртки',
  pants: 'Брюки',
  dresses: 'Платья',
  shoes: 'Обувь',
  accessories: 'Аксессуары',
}

const pageTitle = computed(() => {
  if (route.query.gender === 'women') {
    return 'Женщинам'
  }

  if (route.query.gender === 'men') {
    return 'Мужчинам'
  }

  if (route.query.new === 'true') {
    return 'Новинки'
  }

  if (route.query.sale === 'true') {
    return 'Распродажа'
  }

  if (route.query.category) {
    return categoryLabels[route.query.category]
        || 'Каталог'
  }

  return 'Каталог'
})

const breadcrumbs = computed(() => {
  const items = [
    {
      label: 'Главная',
      to: '/',
    },
  ]

  if (route.query.gender === 'women') {
    items.push({
      label: 'Женщинам',
      to: {
        path: '/shop',
        query: {
          gender: 'women',
        },
      },
    })
  }

  if (route.query.gender === 'men') {
    items.push({
      label: 'Мужчинам',
      to: {
        path: '/shop',
        query: {
          gender: 'men',
        },
      },
    })
  }

  if (route.query.category) {
    items.push({
      label:
          categoryLabels[route.query.category]
          || route.query.category,
    })
  }

  if (route.query.new === 'true') {
    items.push({
      label: 'Новинки',
    })
  }

  if (route.query.sale === 'true') {
    items.push({
      label: 'Распродажа',
    })
  }

  return items
})

const syncFiltersFromUrl = () => {
  productsStore.setFilter('gender', route.query.gender || null )

  productsStore.setFilter('category', route.query.category || null)

  productsStore.setFilter('collection', route.query.collection || null)

  productsStore.setFilter('color', route.query.color || null)

  productsStore.setFilter('size',route.query.size || null)

  productsStore.setFilter('search', route.query.search || '')

  productsStore.setFilter('isNew', route.query.new === 'true')

  productsStore.setFilter('isSale', route.query.sale === 'true')

  productsStore.setFilter('sort',route.query.sort || 'newest')
}

const updateQuery = (key, value) => {
  const query = {
    ...route.query,
  }

  if (
      value === null ||
      value === undefined ||
      value === ''
  ) {
    delete query[key]
  } else {
    query[key] = value
  }

  router.push({
    path: '/shop',
    query,
  })
}

const selectCategory = (value) => {
  updateQuery('category', value)
}

const selectGender = (value) => {
  updateQuery('gender', value)
}

const selectCollection = (value) => {
  updateQuery('collection', value)
}

const selectColor = (value) => {
  updateQuery('color', value)
}

const toggleNew = () => {
 updateQuery('new', productsStore.filters.isNew ? null : true)
}

const toggleSale = () => {
  updateQuery('sale', productsStore.filters.isSale ? null : 'true')
}

const changeSort = (value) => {
  updateQuery('sort', value)
}
const resetFilters = () => {
  router.push({
    path: '/shop',
  })
}

const loadFromUrl = async () => {
  syncFiltersFromUrl()

  await productsStore.fetchProducts()
}

watch(
    () => route.query,
    async () => {
      syncFiltersFromUrl()
      await productsStore.fetchProducts()
    },
    {
      deep: true,
    }
)

onMounted(() => {
  loadFromUrl()
})
</script>


<template>
  <main class="min-h-screen bg-white">
    <div
        class="mx-auto w-full max-w-[1440px] px-5 pb-20 pt-8 sm:px-8 lg:px-10 xl:px-12">

      <nav
          class="mb-5 flex items-center gap-2 text-xs text-neutral-400"
          aria-label="Breadcrumb">
        <template
            v-for="(item, index) in breadcrumbs"
            :key="`${item.label}-${index}`">
        <span
            v-if="index > 0"
            class="text-neutral-300">
            /
          </span>

        <RouterLink
            v-if="item.to"
            :to="item.to"
            class="transition hover:text-black">
          {{ item.label }}
        </RouterLink>

        <span
            v-else
            class="text-neutral-500">
            {{ item.label }}
          </span>
        </template>
      </nav>

      <header class="mb-8">
        <h1
            class="text-3xl font-normal tracking-tight sm:text-4xl">
          {{ pageTitle }}
        </h1>
      </header>

      <div class="mb-5 lg:hidden">
        <button
            type="button"
            class="flex w-full items-center justify-between border border-neutral-200 px-4 py-3 text-sm"
            @click="mobileFiltersOpen = !mobileFiltersOpen">
          <span class="flex items-center gap-2">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5">
              <path d="M4 6h16" />
              <path d="M7 12h10" />
              <path d="M10 18h4" />
            </svg>

            Фильтры
          </span>

          <span>
            {{ mobileFiltersOpen ? '−' : '+' }}
          </span>
        </button>
      </div>

      <div
          v-if="mobileFiltersOpen"
          class="mb-8 lg:hidden">
        <ProductFilters
            :filters="productsStore.filters"
            :has-active-filters="productsStore.hasActiveFilters"
            @update:category="selectCategory"
            @update:gender="selectGender"
            @update:collection="selectCollection"
            @update:color="selectColor"
            @toggle:new="toggleNew"
            @toggle:sale="toggleSale"
            @reset="resetFilters"
        />
      </div>

      <div
          class="grid gap-8 lg:grid-cols-[180px_minmax(0,1fr)]">

        <!-- Sidebar -->
        <aside class="hidden lg:block">
          <ProductFilters
              :filters="productsStore.filters"
              :has-active-filters="productsStore.hasActiveFilters"
              @update:category="selectCategory"
              @update:gender="selectGender"
              @update:collection="selectCollection"
              @update:color="selectColor"
              @toggle:new="toggleNew"
              @toggle:sale="toggleSale"
              @reset="resetFilters"/>
        </aside>

        <!-- Products -->
        <section class="min-w-0">

          <ProductToolbar
              :count="productsStore.productCount"
              :sort="productsStore.filters.sort"
              @update:sort="changeSort"/>

          <!-- Loader -->
          <ProductGridLoader
              v-if="productsStore.loading"/>

          <!-- Products -->
          <ProductGrid
              v-else
              :products="productsStore.products"
              @login="openLogin"/>

        </section>

      </div>

    </div>
  </main>
</template>