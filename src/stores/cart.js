import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

const cartKey = (owner) => `nova-cart:${owner}`
const promoKey = (owner) => `nova-cart-promo:${owner}`

const loadFromStorage = (key, fallback) => {
    try {
        const saved = localStorage.getItem(key)
        return saved ? JSON.parse(saved) : fallback
    } catch (error) {
        console.error(`Ошибка загрузки ${key}:`, error)
        return fallback
    }
}

export const useCartStore = defineStore('cart', () => {
    const ownerId = ref(null)
    const switchingOwner = ref(false)
    const items = ref([])
    const promo = ref(null)

    // Переключить корзину на гостя или конкретного пользователя
    const setOwner = (userId, { clearGuest = false } = {}) => {
        const currentOwner = ownerId.value || 'guest'

        // Сохраняем данные текущего владельца перед переключением
        try {
            localStorage.setItem(
                cartKey(currentOwner),
                JSON.stringify(items.value),
            )

            if (promo.value) {
                localStorage.setItem(
                    promoKey(currentOwner),
                    JSON.stringify(promo.value),
                )
            } else {
                localStorage.removeItem(promoKey(currentOwner))
            }
        } catch (error) {
            console.error('Ошибка сохранения корзины:', error)
        }

        switchingOwner.value = true

        if (clearGuest) {
            localStorage.removeItem(cartKey('guest'))
            localStorage.removeItem(promoKey('guest'))
        }

        ownerId.value = userId || null

        const nextOwner = ownerId.value || 'guest'

        items.value = loadFromStorage(cartKey(nextOwner), [])
        if (!Array.isArray(items.value)) items.value = []

        promo.value = loadFromStorage(promoKey(nextOwner), null)

        switchingOwner.value = false
    }

    const addToCart = (product, size, color, quantity = 1) => {
        const existingItem = items.value.find(
            (item) =>
                item.product.id === product.id &&
                item.size === size &&
                item.color === color,
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
        items.value = items.value.filter((item) => item.id !== itemId)
    }

    const updateQuantity = (itemId, quantity) => {
        const item = items.value.find((item) => item.id === itemId)
        if (!item) return

        if (quantity <= 0) {
            removeFromCart(itemId)
            return
        }

        item.quantity = quantity
    }

    const totalItems = computed(() =>
        items.value.reduce((total, item) => total + item.quantity, 0),
    )

    const totalPrice = computed(() =>
        items.value.reduce(
            (total, item) => total + Number(item.product.price) * item.quantity,
            0,
        ),
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
            Number(totalPrice.value) * Number(promo.value.discount) / 100,
        )
    })

    const finalTotal = computed(() =>
        Math.max(0, Number(totalPrice.value) - discountAmount.value),
    )

    const clearCart = () => {
        items.value = []
        clearPromo()
    }

    watch(
        items,
        (newItems) => {
            if (switchingOwner.value) return

            const owner = ownerId.value || 'guest'

            try {
                localStorage.setItem(cartKey(owner), JSON.stringify(newItems))
            } catch (error) {
                console.error('Ошибка сохранения корзины:', error)
            }
        },
        { deep: true },
    )

    watch(
        promo,
        (newPromo) => {
            if (switchingOwner.value) return

            const owner = ownerId.value || 'guest'

            try {
                if (newPromo) {
                    localStorage.setItem(promoKey(owner), JSON.stringify(newPromo))
                } else {
                    localStorage.removeItem(promoKey(owner))
                }
            } catch (error) {
                console.error('Ошибка сохранения промокода:', error)
            }
        },
        { deep: true },
    )

    return {
        items,
        totalItems,
        totalPrice,
        promo,
        discountAmount,
        finalTotal,
        setOwner,
        setPromo,
        clearPromo,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
    }
})