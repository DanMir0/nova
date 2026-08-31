import { defineStore } from 'pinia'
import { ref } from 'vue'

import {
    getFavorites,
    addFavorite,
    removeFavorite,
} from '../services/favoritesService'

export const useFavoritesStore = defineStore('favorites', () => {

    const favorites = ref([])
    const loading = ref(false)
    const error = ref(null)

    // ========================================
    // ID избранных товаров
    // ========================================

    const favoriteIds = ref(new Set())

    // ========================================
    // Загрузить избранное
    // ========================================

    const fetchFavorites = async () => {
        try {
            loading.value = true
            error.value = null

            const data = await getFavorites()

            favorites.value = data.map(item => item.products)

            favoriteIds.value = new Set(
                data.map(item => item.product_id)
            )

        } catch (err) {
            console.error('Favorites error:', err)

            error.value = 'Не удалось загрузить избранное'

            favorites.value = []
            favoriteIds.value = new Set()
        } finally {
            loading.value = false
        }
    }

    // ========================================
    // Проверить избранное
    // ========================================

    const isFavorite = (productId) => {
        return favoriteIds.value.has(productId)
    }

    // ========================================
    // Добавить / удалить
    // ========================================

    const toggleFavorite = async (product) => {
        if (!product?.id) {
            return
        }

        const productId = product.id
        const currentlyFavorite = isFavorite(productId)

        try {
            error.value = null

            // ------------------------------------
            // УДАЛЯЕМ
            // ------------------------------------

            if (currentlyFavorite) {

                // Сначала меняем интерфейс
                favoriteIds.value.delete(productId)

                favorites.value = favorites.value.filter(
                    item => item.id !== productId
                )

                // Обновляем Set для Vue
                favoriteIds.value = new Set(favoriteIds.value)

                await removeFavorite(productId)

                return
            }

            // ------------------------------------
            // ДОБАВЛЯЕМ
            // ------------------------------------

            favoriteIds.value.add(productId)

            favoriteIds.value = new Set(favoriteIds.value)

            favorites.value.unshift(product)

            await addFavorite(productId)

        } catch (err) {
            console.error('Toggle favorite error:', err)

            // Если Supabase не смог изменить данные,
            // возвращаем предыдущее состояние

            if (currentlyFavorite) {
                favoriteIds.value.add(productId)

                favoriteIds.value = new Set(favoriteIds.value)

                favorites.value.unshift(product)
            } else {
                favoriteIds.value.delete(productId)

                favoriteIds.value = new Set(favoriteIds.value)

                favorites.value = favorites.value.filter(
                    item => item.id !== productId
                )
            }

            error.value = 'Не удалось изменить избранное'
        }
    }

    return {
        favorites,
        favoriteIds,

        loading,
        error,

        fetchFavorites,
        isFavorite,
        toggleFavorite,
    }
})