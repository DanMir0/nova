<script setup>
import {
    computed,
    onMounted,
    ref,
    watch,
} from 'vue'

import { useRoute, useRouter } from 'vue-router'

import { collections } from '../data/collections'
import { useProductsStore } from '../stores/products'

import ProductFilters from '../components/shop/ProductFilters.vue'
import ProductGrid from '../components/shop/ProductGrid.vue'
import ProductGridLoader from '../components/shop/ProductGridLoader.vue'
import ProductToolbar from '../components/shop/ProductToolbar.vue'

const route = useRoute()
const router = useRouter()

const productsStore = useProductsStore()

const mobileFiltersOpen = ref(false)

const collection = computed(() => {
    return collections.find(
        item => item.slug === route.params.collection
    )
})

const syncFiltersFromUrl = () => {

    productsStore.setFilter('collection', route.params.collection || null)

    productsStore.setFilter('gender', route.query.gender || null)

    productsStore.setFilter('category', route.query.category || null)

    productsStore.setFilter('color',route.query.color || null)

    productsStore.setFilter('size', route.query.size || null)

    productsStore.setFilter('search', route.query.search || '')

    productsStore.setFilter('minPrice', route.query.minPrice ? Number(route.query.minPrice) : null)

    productsStore.setFilter('maxPrice', route.query.maxPrice ? Number(route.query.maxPrice) : null)

    productsStore.setFilter('isNew', route.query.new === 'true')

    productsStore.setFilter('isSale', route.query.sale === 'true')

    productsStore.setFilter('sort', route.query.sort || 'newest')
}

const updateQuery = (key, value) => {
    const query = {...route.query,}

    if (
        value === null ||
        value === undefined ||
        value === ''
    ) {
        delete query[key]
    } else {
        query[key] = String(value)
    }

    router.push({
        path: `/collections/${route.params.collection}`,
        query,
    })
}

const selectGender = (value) => {
    updateQuery('gender', value)
}

const selectCategory = (value) => {
    updateQuery('category', value)
}

const selectColor = (value) => {
    updateQuery('color', value)
}

const selectSize = (value) => {
    updateQuery('size', value)
}

const updateMinPrice = (value) => {
    productsStore.setFilter('minPrice', value)
}

const updateMaxPrice = (value) => {
    productsStore.setFilter('maxPrice', value)
}

const applyPrice = () => {
    const query = {
        ...route.query,
    }

    if (productsStore.filters.minPrice != null) {
        query.minPrice = String(
            productsStore.filters.minPrice
        )
    } else {
        delete query.minPrice
    }

    if (productsStore.filters.maxPrice != null) {
        query.maxPrice = String(
            productsStore.filters.maxPrice
        )
    } else {
        delete query.maxPrice
    }

    router.push({
        path: `/collections/${route.params.collection}`,
        query,
    })
}

const toggleNew = () => {
    updateQuery(
        'new',
        productsStore.filters.isNew
            ? null
            : 'true'
    )
}

const toggleSale = () => {
    updateQuery(
        'sale',
        productsStore.filters.isSale
            ? null
            : 'true'
    )
}

const changeSort = (value) => {
    updateQuery('sort', value)
}

const resetFilters = () => {
    router.push({
        path: `/collections/${route.params.collection}`,
    })
}

const loadCollection = async () => {
    syncFiltersFromUrl()

    await productsStore.fetchProducts()
}

watch(
    [
        () => route.params.collection,
        () => route.query,
    ],
    async () => {
        await loadCollection()
    },
    {
        deep: true,
    }
)

onMounted(() => {
    loadCollection()
})
</script>

<template>
    <main class="mx-auto max-w-[1440px] px-5 pb-12 sm:px-8 lg:px-12">

        <section
            v-if="collection"
            class="relative mt-5 h-[230px] overflow-hidden bg-neutral-100 sm:h-[260px] lg:h-[270px]">

            <img
                :src="collection.image"
                :alt="collection.name"
                class="absolute inset-0 h-full w-full object-cover"/>

            <div class="absolute inset-0 bg-white/35" />

            <div class="relative z-10 flex h-full max-w-xl flex-col justify-center px-6 sm:px-10">

                <!-- Breadcrumbs -->
                <nav
                    class="mb-4 flex items-center gap-2 text-xs text-neutral-500">
                    <RouterLink
                        to="/"
                        class="hover:text-black">
                        Главная
                    </RouterLink>

                    <span>/</span>

                    <RouterLink
                        to="/collections"
                        class="hover:text-black">
                        Коллекции
                    </RouterLink>

                    <span>/</span>

                    <span class="text-neutral-700">
                        {{ collection.name }}
                    </span>
                </nav>

                <h1
                    class="text-3xl font-normal tracking-tight sm:text-4xl">
                    {{ collection.name }}
                </h1>

                <p
                    class="mt-3 max-w-md text-sm leading-5 text-neutral-600">
                    {{ collection.description }}
                </p>

            </div>
        </section>

        <!-- UNKNOWN COLLECTION -->
        <section
            v-else
            class="py-20 text-center">
            <h1 class="text-2xl">
                Коллекция не найдена
            </h1>

            <RouterLink
                to="/collections"
                class="mt-4 inline-block text-sm underline">
                Вернуться к коллекциям
            </RouterLink>
        </section>

        <section
            v-if="collection"
            class="mt-7">

            <!-- Mobile filters -->
            <div class="mb-5 lg:hidden">
                <button
                    type="button"
                    class="flex w-full items-center justify-between border border-neutral-200 px-4 py-3 text-sm"
                    @click="mobileFiltersOpen = !mobileFiltersOpen">
                    <span>
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
                    :show-collection="false"
                    @update:gender="selectGender"
                    @update:category="selectCategory"
                    @update:size="selectSize"
                    @update:color="selectColor"
                    @update:minPrice="updateMinPrice"
                    @update:maxPrice="updateMaxPrice"
                    @apply:price="applyPrice"
                    @toggle:new="toggleNew"
                    @toggle:sale="toggleSale"
                    @reset="resetFilters"/>
            </div>

            <div class="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">

                <!-- SIDEBAR -->
                <aside class="hidden lg:block">

                    <ProductFilters
                        :filters="productsStore.filters"
                        :has-active-filters="
                            productsStore.hasActiveFilters"
                        :show-collection="false"
                        @update:gender="selectGender"
                        @update:category="selectCategory"
                        @update:size="selectSize"
                        @update:color="selectColor"
                        @update:minPrice="updateMinPrice"
                        @update:maxPrice="updateMaxPrice"
                        @apply:price="applyPrice"
                        @toggle:new="toggleNew"
                        @toggle:sale="toggleSale"
                        @reset="resetFilters"/>

                    <!-- SEASON -->
                    <div class="py-5">

                        <div class="mb-4">
                            <h2 class="text-sm font-medium">
                                Сезон
                            </h2>
                        </div>

                        <label class="flex items-center gap-2 text-xs">

                            <input
                                type="checkbox"
                                checked
                                disabled/>

                            {{ collection.name }}
                        </label>

                        <RouterLink
                            :to="
                                collection.slug ===
                                'spring-summer'
                                    ? '/collections/autumn-winter'
                                    : '/collections/spring-summer'"
                            class="mt-3 block text-xs text-neutral-500 underline underline-offset-4 hover:text-black">
                            Перейти в другую коллекцию
                        </RouterLink>

                    </div>

                </aside>

                <!-- PRODUCTS -->
                <section class="min-w-0">

                    <ProductToolbar
                        :count="productsStore.productCount"
                        :sort="productsStore.filters.sort"
                        @update:sort="changeSort"
                    />

                    <ProductGridLoader
                        v-if="productsStore.loading"
                    />

                    <!-- Error -->
                    <div
                        v-else-if="productsStore.error"
                        class="py-20 text-center">
                        <p class="text-sm text-red-500">
                            Не удалось загрузить товары.
                        </p>

                        <button
                            type="button"
                            class="mt-4 text-sm underline"
                            @click="loadCollection">
                            Повторить
                        </button>
                    </div>

                    <!-- Empty -->
                    <div v-else-if="!productsStore.products.length"
                        class="py-20 text-center">
                        <p class="text-sm text-neutral-500">
                            В этой коллекции пока нет товаров.
                        </p>
                    </div>


                    <ProductGrid
                        v-else
                        :products="productsStore.products"
                        :collection-name="collection.shortName"/>

                </section>

            </div>
        </section>
    </main>
</template>