<script setup>
import {
  computed,
  onMounted,
  ref,
  watch,
} from 'vue'
import ProductFilters from '../components/shop/ProductFilters.vue'
import ProductGrid from '../components/shop/ProductGrid.vue'
import ProductToolbar from '../components/shop/ProductToolbar.vue'
import ProductGridLoader from '../components/shop/ProductGridLoader.vue'
import {useRoute, useRouter} from 'vue-router'

import {useProductsStore} from '../stores/products'

const route = useRoute()
const router = useRouter()

const productsStore = useProductsStore()

const mobileFiltersOpen = ref(false)

const searchInput = ref(
    productsStore.filters.search
)

const categories = [
  {
    value: 't-shirts',
    label: 'Футболки',
  },
  {
    value: 'shirts',
    label: 'Рубашки',
  },
  {
    value: 'jackets',
    label: 'Жакеты и куртки',
  },
  {
    value: 'pants',
    label: 'Брюки',
  },
  {
    value: 'dresses',
    label: 'Платья',
  },
  {
    value: 'shoes',
    label: 'Обувь',
  },
  {
    value: 'accessories',
    label: 'Аксессуары',
  },
]

const categoryClass = (value) => {
  const active =
      productsStore.filters.category === value

  return [
    'block text-sm transition',
    active
        ? 'font-medium text-neutral-950'
        : 'text-neutral-500 hover:text-neutral-950',
  ]
}

const filterClass = (value, name) => {
  const active =
      productsStore.filters[name] === value

  return [
    'block text-sm transition',
    active
        ? 'font-medium text-neutral-950'
        : 'text-neutral-500 hover:text-neutral-950',
  ]
}

const toggleClass = (active) => {
  return [
    'block text-sm transition',
    active
        ? 'font-medium text-neutral-950'
        : 'text-neutral-500 hover:text-neutral-950',
  ]
}

const updateUrl = async () => {
  const filters = productsStore.filters

  const query = {}

  if (filters.gender) {
    query.gender = filters.gender
  }

  if (filters.category) {
    query.category = filters.category
  }

  if (filters.collection) {
    query.collection = filters.collection
  }

  if (filters.isNew) {
    query.new = 'true'
  }

  if (filters.isSale) {
    query.sale = 'true'
  }

  if (filters.search) {
    query.search = filters.search
  }

  if (filters.sort !== 'newest') {
    query.sort = filters.sort
  }

  await router.replace({
    query,
  })
}

const loadFromUrl = () => {
  const query = route.query

  productsStore.filters.gender = typeof query.gender === 'string'
      ? query.gender
      : null

  productsStore.filters.category =
      typeof query.category === 'string'
          ? query.category
          : null

  productsStore.filters.collection =
      typeof query.collection === 'string'
          ? query.collection
          : null

  productsStore.filters.isNew =
      query.new === 'true'

  productsStore.filters.isSale =
      query.sale === 'true'

  productsStore.filters.search =
      typeof query.search === 'string'
          ? query.search
          : ''

  productsStore.filters.sort =
      typeof query.sort === 'string'
          ? query.sort
          : 'newest'

  searchInput.value =
      productsStore.filters.search
}

const reload = async () => {
  await updateUrl()
  await productsStore.fetchProducts()
}

const selectCategory = async (category) => {
  productsStore.setFilter(
      'category',
      category
  )

  await reload()
}

const selectGender = async (gender) => {
  productsStore.setFilter(
      'gender',
      gender
  )

  await reload()
}

const selectCollection = async (collection) => {
  productsStore.setFilter(
      'collection',
      collection
  )

  await reload()
}

const toggleNew = async () => {
  productsStore.setFilter(
      'isNew',
      !productsStore.filters.isNew
  )

  await reload()
}

const toggleSale = async () => {
  productsStore.setFilter(
      'isSale',
      !productsStore.filters.isSale
  )

  await reload()
}

const resetFilters = async () => {
  productsStore.resetFilters()

  searchInput.value = ''

  await reload()
}

const changeSort = async (event) => {
  productsStore.setFilter(
      'sort',
      event.target.value
  )

  await reload()
}

let searchTimeout

watch(searchInput, (value) => {
  clearTimeout(searchTimeout)

  searchTimeout = setTimeout(async () => {
    productsStore.setFilter(
        'search',
        value.trim()
    )

    await reload()
  }, 400)
})

const syncWithRoute = async () => {
  loadFromUrl()

  await productsStore.fetchProducts()
}

onMounted(() => {
  syncWithRoute()
})

watch(
    () => route.query,
    () => {
      loadFromUrl()
    }
)
</script>

<template>
  <main class="min-h-screen bg-white">
    <section class="mx-auto max-w-[1440px] px-5 pb-24 pt-28 sm:px-8 lg:px-10 lg:pt-36">
      <!-- Header -->
      <div class="mb-10 flex flex-col gap-6 border-b border-neutral-200 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.12em] text-neutral-500">Nova</p>
          <h1 class="mt-3 text-4xl font-light tracking-[-0.03em] sm:text-5xl">Магазин</h1>
          <p class="mt-3 text-sm text-neutral-500">{{ productsStore.productCount }} товаров</p>
        </div>

        <!-- Search -->
        <div class="relative w-full lg:w-80">
          <input
              v-model="searchInput"
              type="search"
              placeholder="Поиск товаров..."
              class="w-full border-b border-neutral-300 bg-transparent py-3 pr-4 text-sm outline-none transition focus:border-neutral-950"
          />
        </div>
      </div>

      <!-- Mobile filters button -->
      <button
          type="button"
          class="mb-8 flex w-full items-center justify-center border border-neutral-300 px-5 py-3 text-sm lg:hidden"
          @click="mobileFiltersOpen = !mobileFiltersOpen">
        Фильтры
      </button>

      <!-- ★★★ ИСПРАВЛЕННАЯ СТРУКТУРА ★★★ -->
      <div class="grid gap-10 lg:grid-cols-[220px_1fr]">
        <!-- Sidebar -->
        <aside>
          <ProductFilters
              :filters="productsStore.filters"
              :has-active-filters="productsStore.hasActiveFilters"
              @update:category="selectCategory"
              @update:gender="selectGender"
              @update:collection="selectCollection"
              @toggle:new="toggleNew"
              @toggle:sale="toggleSale"
              @reset="resetFilters"/>
        </aside>

        <!-- Products -->
        <section>
          <ProductToolbar
              :count="productsStore.productCount"
              :sort="productsStore.filters.sort"
              @update:sort="changeSort"/>

          <!-- Loading -->
          <ProductGridLoader v-if="productsStore.loading" />

          <!-- Error -->
          <div v-else-if="productsStore.error" class="py-20 text-center">
            <p class="text-sm text-red-500">{{ productsStore.error }}</p>
          </div>

          <!-- Grid -->
          <ProductGrid v-else :products="productsStore.products" />
        </section>
      </div>
    </section>
  </main>
</template>

<style scoped>

</style>