<script setup>
import {computed, onMounted, ref, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'

import {useProductsStore} from '../stores/products'

import ProductFilters from '../components/shop/ProductFilters.vue'
import ProductGrid from '../components/shop/ProductGrid.vue'
import ProductGridLoader from '../components/shop/ProductGridLoader.vue'
import ProductToolbar from '../components/shop/ProductToolbar.vue'

const route = useRoute()
const router = useRouter()

const productsStore = useProductsStore()

const mobileFiltersOpen = ref(false)
const isNewPage = computed(() => {
    return route.query.new === 'true'
})

const categoryLabels = {
    't-shirts': 'Футболки',
    shirts: 'Рубашки',
    jackets: 'Жакеты и куртки',
    pants: 'Брюки',
    dresses: 'Платья',
    skirts: 'Юбки',
    shorts: 'Шорты',
    suits: 'Костюмы',
    outerwear: 'Верхняя одежда',
    shoes: 'Обувь',
    accessories: 'Аксессуары',
}

const pageTitle = computed(() => {
    if (route.query.new === 'true') {
        return 'Новинки'
    }

    if (route.query.gender === 'women') {
        return 'Женщинам'
    }

    if (route.query.gender === 'men') {
        return 'Мужчинам'
    }

    if (route.query.sale === 'true') {
        return 'Распродажа'
    }

    if (route.query.category) {
        return (
            categoryLabels[route.query.category] ||
            'Каталог'
        )
    }

    if (route.query.collection === 'spring-summer') {
        return 'Весна / Лето'
    }

    if (route.query.collection === 'autumn-winter') {
        return 'Осень / Зима'
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

    if (route.query.gender) {
        items.push({
            label: route.query.gender === 'women' ? 'Женщинам' : 'Мужчинам',
            to: {
                path: '/shop',
                query: {
                    gender: route.query.gender,
                },
            },
        })
    }

    if (route.query.collection) {
        items.push({label: route.query.collection === 'spring-summer' ? 'Весна / Лето' : 'Осень / Зима',})
    }

    if (route.query.category) {
        items.push({label: categoryLabels[route.query.category] || route.query.category,})
    }

    if (route.query.new === 'true') {
        items.push({label: 'Новинки',})
    }

    if (route.query.sale === 'true') {
        items.push({label: 'Распродажа',})
    }

    return items
})

const syncFiltersFromUrl = () => {
    productsStore.setFilter('gender', route.query.gender || null)

    productsStore.setFilter('category', route.query.category || null)

    productsStore.setFilter('collection', route.query.collection || null)

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

const selectSize = (value) => {
    updateQuery('size', value)
}

const selectColor = (value) => {
    updateQuery('color', value)
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
        path: '/shop',
        query,
    })
}

const resetPrice = () => {
    productsStore.setFilter('minPrice', null)
    productsStore.setFilter('maxPrice', null)
    console.log('clicj')
    const query = {
        ...route.query,
    }

    delete query.minPrice
    delete query.maxPrice

    router.push({
        path: '/shop',
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
    productsStore.resetFilters()

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

        <div class="mx-auto w-full max-w-[1440px] px-5 pb-20 pt-8 sm:px-8 lg:px-10 xl:px-12">

            <!-- Breadcrumbs -->
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

            <section
                v-if="isNewPage"
                class="relative mt-5 h-[230px] overflow-hidden bg-neutral-100 sm:h-[260px] lg:h-[270px]">

                <img
                    src="/images/newProduct.jpg"
                    alt="Новинки Nova"
                    class="absolute inset-0 h-full w-full object-cover"/>

                <div class="absolute inset-0 bg-white/35" />

                <div class="relative z-10 flex h-full max-w-xl flex-col justify-center px-6 sm:px-10">

                    <nav
                        class="mb-4 flex items-center gap-2 text-xs text-neutral-500"
                        aria-label="Breadcrumb">
                        <RouterLink
                            to="/"
                            class="hover:text-black">
                            Главная
                        </RouterLink>

                        <span>/</span>

                        <span class="text-neutral-700">
                            Новинки
                        </span>
                    </nav>

                    <!-- Title -->
                    <h1 class="text-3xl font-normal tracking-tight sm:text-4xl">
                        Новинки
                    </h1>

                    <!-- Description -->
                    <p class="mt-3 max-w-md text-sm leading-5 text-neutral-600">
                        Новые модели Nova — актуальные силуэты,
                        современные материалы и вещи для нового сезона.
                    </p>
                </div>
            </section>

            <!-- Header -->
            <header class="mb-8">
                <h1 class="text-3xl font-normal tracking-tight sm:text-4xl">
                    {{ pageTitle }}
                </h1>
            </header>

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

            <div v-if="mobileFiltersOpen"
                 class="mb-8 lg:hidden">
                <ProductFilters
                        :filters="productsStore.filters"
                        :has-active-filters="productsStore.hasActiveFilters"
                        @update:category="selectCategory"
                        @update:gender="selectGender"
                        @update:collection="selectCollection"
                        @update:size="selectSize"
                        @update:color="selectColor"
                        @update:minPrice="updateMinPrice"
                        @update:maxPrice="updateMaxPrice"
                        @apply:price="applyPrice"
                        @toggle:new="toggleNew"
                        @toggle:sale="toggleSale"
                        @reset:filter="resetFilters"
                        @reset:price="resetPrice"/>
            </div>

            <!-- Catalog -->
            <div class="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">

                <!-- Sidebar -->
                <aside class="hidden lg:block">
                    <ProductFilters
                            :filters="productsStore.filters"
                            :has-active-filters="productsStore.hasActiveFilters"
                            @update:category="selectCategory"
                            @update:gender="selectGender"
                            @update:collection="selectCollection"
                            @update:size="selectSize"
                            @update:color="selectColor"
                            @update:minPrice="updateMinPrice"
                            @update:maxPrice="updateMaxPrice"
                            @apply:price="applyPrice"
                            @toggle:new="toggleNew"
                            @toggle:sale="toggleSale"
                            @reset:filter="resetFilters"
                            @reset:price="resetPrice"/>

                </aside>

                <!-- Products -->
                <section class="min-w-0">

                    <ProductToolbar
                            :count="productsStore.productCount"
                            :sort="productsStore.filters.sort"
                            @update:sort="changeSort"/>

                    <ProductGridLoader v-if="productsStore.loading"/>

                    <div v-else-if="productsStore.error"
                         class="py-20 text-center">

                        <p class="text-sm text-red-500">
                            Не удалось загрузить товары.
                        </p>

                        <button
                                type="button"
                                class="mt-4 text-sm underline"
                                @click="productsStore.fetchProducts()">
                            Повторить
                        </button>
                    </div>

                    <div v-else-if="!productsStore.products.length"
                         class="py-20 text-center">
                        <p class="text-sm text-neutral-500">
                            Товары не найдены.
                        </p>
                    </div>

                    <ProductGrid
                            v-else
                            :products="productsStore.products"/>

                </section>
            </div>
        </div>
    </main>
</template>