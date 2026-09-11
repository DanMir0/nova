<script setup>
import {computed, ref} from 'vue'
import {useRouter} from 'vue-router'
import {
    MapPin,
    Truck,
} from 'lucide-vue-next'

import {supabase} from "../lib/supabase.js";
import {useCartStore} from '../stores/cart'
import {useAddressesStore} from '../stores/addresses'
import {createOrder} from '../services/orders.js'
import {formatPrice} from '../utils/formatPrice'

const router = useRouter()

const cartStore = useCartStore()
const addressesStore = useAddressesStore()
const creatingOrder = ref(false)
const orderError = ref(null)

const deliveryMethods = [
    {
        id: 'courier',
        title: 'Курьерская доставка',
        description: 'Доставка курьером до двери',
        time: '1–3 рабочих дня',
        price: 0,
    },
    {
        id: 'pickup',
        title: 'Пункт выдачи',
        description: 'Получение заказа в пункте выдачи',
        time: '2–4 рабочих дня',
        price: 0,
    },
]

const selectedDeliveryId =
    localStorage.getItem('nova-delivery-method') || 'courier'

const deliveryMethod = computed(() => {
    return deliveryMethods.find(
        method => method.id === selectedDeliveryId
    )
})

const deliveryPrice = computed(() => {
    return deliveryMethod.value?.price || 0
})

const totalPrice = computed(() => {
    return cartStore.totalPrice + deliveryPrice.value
})

const goToCart = () => {
    router.push('/cart')
}

const goToDelivery = () => {
    router.push('/delivery')
}

const goToCheckout = () => {
    router.push('/checkout')
}

const handleCreateOrder = async () => {
    if (creatingOrder.value) {
        return
    }

    orderError.value = null

    if (!cartStore.items.length) {
        orderError.value = 'Корзина пуста.'
        return
    }

    if (!addressesStore.selectedAddress) {
        orderError.value = 'Выберите адрес доставки.'
        return
    }

    try {
        creatingOrder.value = true

        // Получаем текущего авторизованного пользователя
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser()

        if (userError) {
            throw userError
        }

        if (!user) {
            orderError.value =
                'Для оформления заказа необходимо войти в аккаунт.'

            return
        }

        const order = await createOrder({
            userId: user.id,

            cartItems: cartStore.items,

            address: addressesStore.selectedAddress,

            deliveryMethod: selectedDeliveryId,

            deliveryPrice:
                deliveryMethod.value?.price || 0,

            total:
                cartStore.totalPrice +
                (deliveryMethod.value?.price || 0),
        })

        // Заказ успешно создан
        cartStore.clearCart()

        // Переходим на страницу успешного заказа
        router.push({
            name: 'order-success',
            query: {
                order: order.id,
            },
        })
    } catch (error) {
        console.error('Create order error:', error)

        orderError.value =
            'Не удалось оформить заказ. Попробуйте ещё раз.'
    } finally {
        creatingOrder.value = false
    }
}
</script>

<template>
    <main class="min-h-screen bg-white">

        <div
                class="mx-auto max-w-[1440px] px-5 pb-20 pt-8 sm:px-8 lg:px-10">

            <h1
                    class="text-2xl font-normal tracking-tight sm:text-3xl">

                Подтверждение заказа

            </h1>

            <div
                    class="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:gap-10">

                <section class="min-w-0">

                    <div
                            class="border border-neutral-200">

                        <div
                                class="border-b border-neutral-200 px-5 py-4 sm:px-6">

                            <h2 class="text-sm font-medium">
                                Товары
                            </h2>

                        </div>

                        <div>

                            <article
                                    v-for="item in cartStore.items"
                                    :key="item.id"
                                    class="flex gap-4 border-b border-neutral-200 px-5 py-5 last:border-b-0 sm:px-6">

                                <div
                                        class="h-28 w-20 shrink-0 overflow-hidden bg-neutral-100">

                                    <img
                                            v-if="item.product.images?.length"
                                            :src="item.product.images[0]"
                                            :alt="item.product.name"
                                            class="h-full w-full object-cover"/>

                                    <img
                                            v-else-if="item.product.image_url"
                                            :src="item.product.image_url"
                                            :alt="item.product.name"
                                            class="h-full w-full object-cover"/>

                                </div>

                                <div class="min-w-0 flex-1">

                                    <div class="flex items-start justify-between gap-5">

                                        <div>

                                            <h3 class="text-sm">
                                                {{ item.product.name }}
                                            </h3>

                                            <p class="mt-2 text-xs text-neutral-400">
                                                Размер:
                                                {{ item.size }}

                                            </p>

                                            <p v-if="item.color"
                                               class="mt-1 text-xs text-neutral-400">
                                                Цвет:
                                                {{ item.color }}

                                            </p>
                                            <p
                                                    class="mt-1 text-xs text-neutral-400">

                                                Количество:
                                                {{ item.quantity }}

                                            </p>

                                        </div>

                                        <p
                                                class="shrink-0 text-sm font-medium">
                                            {{ formatPrice(Number(item.product.price) * item.quantity) }}

                                        </p>

                                    </div>

                                </div>

                            </article>

                        </div>

                        <div class="border-t border-neutral-200 px-5 py-4 sm:px-6">

                            <button
                                    type="button"
                                    class="cursor-pointer text-xs underline underline-offset-4 transition hover:text-neutral-500"
                                    @click="goToCart">
                                Изменить корзину

                            </button>

                        </div>

                    </div>

                    <div class="mt-6 border border-neutral-200">

                        <div class="flex items-center justify-between border-b border-neutral-200 px-5 py-4 sm:px-6">

                            <div
                                    class="flex items-center gap-2">

                                <MapPin
                                        :size="17"
                                        :stroke-width="1.5"/>

                                <h2 class="text-sm font-medium">
                                    Адрес доставки
                                </h2>

                            </div>

                            <button
                                    type="button"
                                    class="cursor-pointer text-xs underline underline-offset-4 transition hover:text-neutral-500"
                                    @click="goToCheckout">
                                Изменить

                            </button>

                        </div>

                        <div
                                v-if="addressesStore.selectedAddress"
                                class="px-5 py-5 sm:px-6">

                            <p class="text-sm">
                                {{ addressesStore.selectedAddress.title }}
                            </p>

                            <p class="mt-2 text-xs leading-5 text-neutral-400">

                                {{ addressesStore.selectedAddress.city }},
                                {{ addressesStore.selectedAddress.address }}

                            </p>

                            <p
                                    class="mt-1 text-xs text-neutral-400">

                                {{ addressesStore.selectedAddress.recipient }}
                                ·
                                {{ addressesStore.selectedAddress.phone }}

                            </p>

                        </div>

                        <div
                                v-else
                                class="px-5 py-5 sm:px-6">

                            <p class="text-sm">
                                Адрес не выбран
                            </p>

                            <button
                                    type="button"
                                    class="mt-3 cursor-pointer text-xs underline underline-offset-4"
                                    @click="goToCheckout">

                                Выбрать адрес

                            </button>

                        </div>

                    </div>

                    <div class="mt-6 border border-neutral-200">


                        <div class="flex items-center justify-between border-b border-neutral-200 px-5 py-4 sm:px-6">

                            <div class="flex items-center gap-2">

                                <Truck
                                        :size="17"
                                        :stroke-width="1.5"/>

                                <h2 class="text-sm font-medium">
                                    Способ доставки
                                </h2>

                            </div>

                            <button
                                    type="button"
                                    class="cursor-pointer text-xs underline underline-offset-4 transition hover:text-neutral-500"
                                    @click="goToDelivery">

                                Изменить
                            </button>

                        </div>

                        <div
                                v-if="deliveryMethod"
                                class="px-5 py-5 sm:px-6">

                            <p class="text-sm">
                                {{ deliveryMethod.title }}
                            </p>

                            <p class="mt-2 text-xs text-neutral-400">

                                {{ deliveryMethod.description }}

                            </p>

                            <p class="mt-1 text-xs text-neutral-400">

                                Срок:
                                {{ deliveryMethod.time }}

                            </p>

                        </div>

                    </div>

                </section>

                <aside class="h-fit border border-neutral-200">

                    <div class="p-5 sm:p-6">

                        <h2 class="text-lg font-medium">
                            Итого
                        </h2>

                        <div
                                class="mt-6 flex justify-between text-sm">

                            <span class="text-neutral-500">
                                Товары
                            </span>
                            <span>
                            {{ formatPrice(cartStore.totalPrice) }}
                          </span>

                        </div>

                        <div
                                class="mt-3 flex justify-between text-sm">

                            <span class="text-neutral-500">
                                Доставка
                            </span>
                            <span>
                                {{   deliveryPrice === 0 ? 'Бесплатно' : formatPrice(deliveryPrice) }}
                            </span>

                        </div>

                        <div
                                class="mt-6 flex justify-between border-t border-neutral-200 pt-6">

                            <span class="font-medium">
                                Итого
                            </span>
                            <span class="font-medium">
                                {{ formatPrice(totalPrice) }}
                            </span>

                        </div>

                        <p v-if="orderError"
                            class="mb-4 text-sm text-red-600">
                            {{ orderError }}
                        </p>

                        <button
                            type="button"
                            @click="handleCreateOrder"
                            :disabled="creatingOrder"
                            class="w-full cursor-pointer bg-neutral-950 px-6 py-4 text-sm uppercase tracking-wider text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50">
                            {{ creatingOrder ? 'Оформление...' : 'Оформить заказ' }}
                        </button>

                        <p class="mt-4 text-center text-[10px] leading-4 text-neutral-400">

                            Нажимая «Оформить заказ», вы подтверждаете
                            выбранные товары и адрес доставки.

                        </p>

                    </div>

                    <div
                            class="grid grid-cols-3 border-t border-neutral-200">

                        <div
                                class="px-2 py-4 text-center">

                            <p class="text-[9px] font-medium">
                                Бесплатная
                            </p>

                            <p
                                    class="mt-1 text-[8px] text-neutral-400">
                                доставка
                            </p>

                        </div>

                        <div
                                class="border-x border-neutral-200 px-2 py-4 text-center">

                            <p class="text-[9px] font-medium">
                                Быстрая
                            </p>

                            <p
                                    class="mt-1 text-[8px] text-neutral-400">
                                доставка
                            </p>

                        </div>

                        <div
                                class="px-2 py-4 text-center">

                            <p class="text-[9px] font-medium">
                                Безопасная
                            </p>

                            <p
                                    class="mt-1 text-[8px] text-neutral-400">
                                покупка
                            </p>

                        </div>


                    </div>

                </aside>
            </div>

        </div>

    </main>
</template>