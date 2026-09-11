[11.09.2026 21:58] Dethrone:
<script setup>
import {onMounted, ref} from 'vue'
import {supabase} from '../../lib/supabase'
import {getUserOrders} from '../../services/orders'

const orders = ref([])
const loading = ref(true)
const errorMessage = ref(null)

const statusLabels = {
    pending: 'Ожидает подтверждения',
    confirmed: 'Подтверждён',
    processing: 'В обработке',
    shipped: 'Передан в доставку',
    delivered: 'Доставлен',
    cancelled: 'Отменён',
}

const deliveryLabels = {
    courier: 'Курьерская доставка',
    pickup: 'Пункт выдачи',
}

const formatPrice = (price) => {
    return `${Number(price).toLocaleString('ru-RU')} ₽`
}

const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
        'ru-RU',
        {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        }
    )
}

const getShortOrderId = (id) => {
    return id.slice(0, 8).toUpperCase()
}

const loadOrders = async () => {
    try {
        loading.value = true
        errorMessage.value = null

        const {
            data: {user},
            error: userError,
        } = await supabase.auth.getUser()

        if (userError) {
            throw userError
        }

        if (!user) {
            orders.value = []
            return
        }

        orders.value = await getUserOrders(user.id)
    } catch (error) {
        console.error('Load orders error:', error)

        errorMessage.value =
            'Не удалось загрузить заказы.'
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    loadOrders()
})
</script>

<template>
    <section class="mt-12">
        <div class="mb-6 flex items-end justify-between border-b border-neutral-200 pb-4">
            <div>
                <p class="text-xs uppercase tracking-[0.2em] text-neutral-500">
                    История
                </p>

                <h2 class="mt-2 text-2xl font-light">
                    Мои заказы
                </h2>
            </div>

            <span
                    v-if="!loading"
                    class="text-sm text-neutral-500">
                {{ orders.length }}
            </span>
        </div>

        <!-- Загрузка -->
        <div
                v-if="loading"
                class="py-12 text-center text-sm text-neutral-500">
            Загружаем заказы...
        </div>

        <!-- Ошибка -->
        <div
                v-else-if="errorMessage"
                class="border border-red-200 px-5 py-4 text-sm text-red-600">
            {{ errorMessage }}
        </div>

        <!-- Нет заказов -->
        <div
                v-else-if="orders.length === 0"
                class="border border-neutral-200 px-6 py-12 text-center">
            <p class="text-sm text-neutral-500">
                У вас пока нет заказов
            </p>
        </div>

        <!-- Заказы -->
        <div v-else
             class="space-y-6">
            <article
                    v-for="order in orders"
                    :key="order.id"
                    class="border border-neutral-200">
                <!-- Header заказа -->
                <div
                        class="flex flex-col gap-3 border-b border-neutral-200 px-5 py-5 sm:flex-row sm:items-center
                        sm:justify-between">
                    <div>
                        <p class="text-sm">
                            Заказ #{{ getShortOrderId(order.id) }}
                        </p>

                        <p class="mt-1 text-xs text-neutral-500">
                            {{ formatDate(order.created_at) }}
                        </p>
                    </div>

                    <span
                            class="text-xs uppercase tracking-wider text-neutral-600">
                        {{ statusLabels[order.status] || order.status }}
                    </span>
                </div>

                <div class="divide-y divide-neutral-100">
                    <div
                            v-for="item in order.order_items"
                            :key="item.id"
                            class="flex gap-4 px-5 py-5">
                        <div
                                class="h-24 w-20 shrink-0 overflow-hidden bg-neutral-100">
                            <img
                                    v-if="item.product_image"
                                    :src="item.product_image"
                                    :alt="item.product_name"
                                    class="h-full w-full object-cover">

                            <div
                                    v-else
                                    class="flex h-full items-center justify-center text-xs text-neutral-400">
                                Нет фото
                            </div>
                        </div>

                        <div class="min-w-0 flex-1">
                            <p class="text-sm">
                                {{ item.product_name }}
                            </p>

                            <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500">
                                <span v-if="item.size">
                                    Размер: {{ item.size }}
                                </span>

                                <span v-if="item.color">
                                    Цвет: {{ item.color }}
                                </span>

                                <span>
                                    Количество: {{ item.quantity }}
                                </span>
                            </div>

                            <p class="mt-3 text-sm">
                                {{ formatPrice(item.price) }}
                            </p>
                        </div>

                        <div class="shrink-0 text-right">
                            <p class="text-sm">
                                {{ formatPrice(item.price * item.quantity) }}
                            </p>
                        </div>
                    </div>
                </div>

                <div class="border-t border-neutral-200 px-5 py-5">
                    <div class="grid gap-5 text-sm sm:grid-cols-2">
                        <div>
                            <p class="text-xs uppercase tracking-wider text-neutral-400">
                                Доставка
                            </p>

                            <p class="mt-2">
                                {{ deliveryLabels[order.delivery_method] || order.delivery_method }}
                            </p>

                            <p class="mt-1 text-xs text-neutral-500">
                                {{ order.city }},
                                {{ order.address }}
                            </p>
                        </div>

                        <div class="sm:text-right">
                            <p class="text-xs uppercase tracking-wider text-neutral-400">
                                Итого
                            </p>

                            <p class="mt-2 text-lg">
                                {{ formatPrice(order.total) }}
                            </p>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    </section>
</template>