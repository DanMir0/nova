import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

const CART_STORAGE_KEY = 'nova-cart'
const PROMO_STORAGE_KEY = 'nova-cart-promo'

const loadFromStorage = (key, fallback) => {
    try {
        const saved = localStorage.getItem(key)

        if (!saved) {
            return fallback
        }

        return JSON.parse(saved)
    } catch (error) {
        console.error(`Ошибка загрузки ${key}:`, error)
        return fallback
    }
}

const loadCart = () => {
    const saved = loadFromStorage(CART_STORAGE_KEY, [])
    return Array.isArray(saved) ? saved : []
}

export const useCartStore = defineStore('cart', () => {
    const items = ref(loadCart())

    const addToCart = (
        product,
        size,
        color,
        quantity = 1
    ) => {
        const existingItem = items.value.find(
            (item) =>
                item.product.id === product.id &&
                item.size === size &&
                item.color === color
        )

        if (existingItem) {
            existingItem.quantity += quantity
            return
        }

        items.value.push({
            id: crypto.randomUUID(),
            product,
            size,
            color,
            quantity,
        })
    }

    const removeFromCart = (itemId) => {
        items.value = items.value.filter(
            (item) => item.id !== itemId
        )
    }

    const updateQuantity = (itemId, quantity) => {
        const item = items.value.find(
            (item) => item.id === itemId
        )

        if (!item) return

        if (quantity <= 0) {
            removeFromCart(itemId)
            return
        }

        item.quantity = quantity
    }

    const totalItems = computed(() => {
        return items.value.reduce(
            (total, item) => total + item.quantity,
            0
        )
    })

    const totalPrice = computed(() => {
        return items.value.reduce(
            (total, item) =>
                total +
                Number(item.product.price) * item.quantity,
            0
        )
    })

    const promo = ref(
        loadFromStorage(PROMO_STORAGE_KEY, null)
    )
    const setPromo = (data) => {
        promo.value = data
    }

    const clearPromo = () => {
        promo.value = null
    }

    const discountAmount = computed(() => {
        if (!promo.value) return 0

        return Math.round(
            Number(totalPrice.value) *
            Number(promo.value.discount) / 100
        )
    })

    const finalTotal = computed(() => {
        return Math.max(
            0,
            Number(totalPrice.value) - discountAmount.value
        )
    })

    const clearCart = () => {
        items.value = []
        clearPromo()
    }

    watch(
        items,
        (newItems) => {
            try {
                localStorage.setItem(
                    CART_STORAGE_KEY,
                    JSON.stringify(newItems)
                )
            } catch (error) {
                console.error('Ошибка сохранения корзины:', error)
            }
        },
        { deep: true }
    )

    watch(
        promo,
        (newPromo) => {
            try {
                if (newPromo) {
                    localStorage.setItem(
                        PROMO_STORAGE_KEY,
                        JSON.stringify(newPromo)
                    )
                } else {
                    localStorage.removeItem(PROMO_STORAGE_KEY)
                }
            } catch (error) {
                console.error('Ошибка сохранения промокода:', error)
            }
        },
        { deep: true }
    )

    return {
        items,
        totalItems,
        totalPrice,
        promo,
        discountAmount,
        finalTotal,
        setPromo,
        clearPromo,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
    }
})