import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useCartStore = defineStore('cart', () => {
    const items = ref([])

    const addToCart = (product, size, color, quantity = 1) => {
        const existingItem = items.value.find(
            item =>
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
            item => item.id !== itemId
        )
    }

    const updateQuantity = (itemId, quantity) => {
        const item = items.value.find(
            item => item.id === itemId
        )

        if (!item) return

        if (quantity <= 0) {
            removeFromCart(itemId)
            return
        }

        item.quantity = quantity
    }

    const clearCart = () => {
        items.value = []
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
                Number(item.product.price) *
                item.quantity,
            0
        )
    })

    return {
        items,

        totalItems,
        totalPrice,

        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
    }
})