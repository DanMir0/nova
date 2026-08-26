import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import { getProducts } from '../services/productsService'

export const useProductsStore = defineStore('products', () => {
    const products = ref([])

    const loading = ref(false)
    const error = ref(null)

    const filters = ref({
        gender: null,
        category: null,
        collection: null,

        isNew: false,
        isSale: false,

        search: '',
        sort: 'newest',
    })

    const fetchProducts = async () => {
        try {
            loading.value = true
            error.value = null

            products.value = await getProducts(filters.value)

            console.log(
                'Products loaded:',
                products.value.length
            )
        } catch (err) {
            console.error('Products error:', err)

            error.value = 'Не удалось загрузить товары'
            products.value = []
        } finally {
            loading.value = false
        }
    }

    const setFilter = (name, value) => {
        filters.value[name] = value
    }

    const resetFilters = () => {
        filters.value = {
            gender: null,
            category: null,
            collection: null,
            isNew: false,
            isSale: false,
            search: '',
            sort: 'newest',
        }
    }

    const productCount = computed(() => {
        return products.value.length
    })

    const hasActiveFilters = computed(() => {
        return (
            filters.value.gender !== null ||
            filters.value.category !== null ||
            filters.value.collection !== null ||
            filters.value.isNew ||
            filters.value.isSale ||
            filters.value.search !== ''
        )
    })

    return {
        products,
        loading,
        error,

        filters,

        productCount,
        hasActiveFilters,

        fetchProducts,
        setFilter,
        resetFilters,
    }
})