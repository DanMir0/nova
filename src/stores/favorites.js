import { defineStore } from 'pinia'
import {computed, ref} from 'vue'
import { supabase } from '../lib/supabase'
import { useAuthStore } from './auth'

export const useFavoritesStore = defineStore('favorites', () => {
    const favorites = ref([])
    const loading = ref(false)
    const initialized = ref(false)

    const authStore = useAuthStore()

    const favoriteIds = computed(() => {
        return new Set(
            favorites.value.map((favorite) => favorite.product_id)
        )
    })

    const isFavorite = (productId) => {
        return favoriteIds.value.has(productId)
    }

    const initialize = async () => {
        if (initialized.value) {
            return
        }

        await loadFavorites()
    }

    const loadFavorites = async () => {
        if (!authStore.user) {
            favorites.value = []
            initialized.value = true
            return
        }

        try {
            loading.value = true

            const { data, error } = await supabase
                .from('favorites')
                .select(`
          id,
          product_id,
          created_at,
          products (*)
        `)
                .eq('user_id', authStore.user.id)
                .order('created_at', {
                    ascending: false,
                })

            if (error) {
                throw error
            }

            favorites.value = data || []
            initialized.value = true

        } catch (error) {
            console.error('Load favorites error:', error)
        } finally {
            loading.value = false
        }
    }

    const addFavorite = async (productId) => {
        if (!authStore.user) {
            return {
                success: false,
                requiresAuth: true,
            }
        }

        if (isFavorite(productId)) {
            return {
                success: true,
            }
        }

        try {
            const { data, error } = await supabase
                .from('favorites')
                .insert({
                    user_id: authStore.user.id,
                    product_id: productId,
                })
                .select(`
                id,
                product_id,
                created_at,
                products (*)
            `)
                .single()

            if (error) {
                throw error
            }

            favorites.value.unshift(data)

            return {
                success: true,
                favorite: data,
            }

        } catch (error) {
            console.error('Add favorite error:', error)

            return {
                success: false,
                error: error.message,
            }
        }
    }

    const removeFavorite = async (productId) => {
        if (!authStore.user) {
            return {
                success: false,
                requiresAuth: true,
            }
        }

        try {
            const { error } = await supabase
                .from('favorites')
                .delete()
                .eq('user_id', authStore.user.id)
                .eq('product_id', productId)

            if (error) {
                throw error
            }

            favorites.value = favorites.value.filter(
                (favorite) => favorite.product_id !== productId
            )

            return {
                success: true,
            }

        } catch (error) {
            console.error('Remove favorite error:', error)

            return {
                success: false,
                error: error.message,
            }
        }
    }

    const toggleFavorite = async (productId) => {
        if (isFavorite(productId)) {
            return await removeFavorite(productId)
        }

        return await addFavorite(productId)
    }

    const clearFavorites = () => {
        favorites.value = []
        initialized.value = false
    }

    return {
        favorites,
        loading,
        initialized,

        isFavorite,
        loadFavorites,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        clearFavorites,
        initialize,
    }
})