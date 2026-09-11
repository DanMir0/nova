<script setup>
import {ref} from 'vue'
import {
    Truck,
    RefreshCcw,
    ShieldCheck,
    X,
} from 'lucide-vue-next'

import {useCartStore} from '../stores/cart'
import {formatPrice} from '../utils/formatPrice'

const cartStore = useCartStore()

const promoCode = ref('')
const promoApplied = ref(false)

const colorNames = {
    beige: 'Бежевый',
    brown: 'Коричневый',
    black: 'Чёрный',
    white: 'Белый',
    yellow: 'Жёлтый',
    grey: 'Серый',
    blue: 'Синий',
}

const getColorName = (color) => {
    return colorNames[color] || color
}

const applyPromo = () => {
    if (!promoCode.value.trim()) {
        return
    }

    promoApplied.value = true
}

const removePromo = () => {
    promoCode.value = ''
    promoApplied.value = false
}
</script>

<template>
    <main class="min-h-screen bg-white">

        <div
                class="mx-auto max-w-[1440px] px-5 pb-20 pt-8 sm:px-8 lg:px-10">

            <div class="flex items-center gap-3">

                <h1 class="text-2xl font-normal tracking-tight sm:text-3xl">
                    Корзина
                </h1>

                <span
                        v-if="cartStore.totalItems"
                        class="text-xs text-neutral-400">
                  {{ cartStore.totalItems }}
                  {{ cartStore.totalItems === 1 ? 'товар' : 'товара' }}
                </span>

            </div>

            <div
                    v-if="!cartStore.items.length"
                    class="flex min-h-[500px] flex-col items-center justify-center text-center">

                <h2 class="text-xl font-normal">
                    Ваша корзина пуста
                </h2>

                <p class="mt-3 text-sm text-neutral-400">
                    Добавьте товары, чтобы оформить заказ
                </p>

                <RouterLink
                        to="/shop"
                        class="mt-8 cursor-pointer bg-black px-8 py-4 text-sm text-white transition hover:bg-neutral-800">
                    Перейти в магазин
                </RouterLink>

            </div>

            <div
                    v-else
                    class="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:gap-10">

                <section class="min-w-0">

                    <!-- TABLE HEADER -->
                    <div
                            class="hidden grid-cols-[minmax(0,1fr)_100px_140px_110px_24px] items-center gap-5 border-b border-neutral-200 px-0 pb-4 text-[10px] uppercase tracking-wide text-neutral-400 md:grid">

                        <span>
                          Товар
                        </span>

                        <span>
                          Цена
                        </span>

                        <span>
                          Количество
                        </span>

                        <span>
                          Итого
                        </span>

                        <span></span>

                    </div>

                    <div>

                        <article
                                v-for="item in cartStore.items"
                                :key="item.id"
                                class="grid gap-4 border-b border-neutral-200 py-5 md:grid-cols-[minmax(0,1fr)_100px_140px_110px_24px] md:items-center md:gap-5">

                            <!-- PRODUCT -->
                            <div class="flex min-w-0 gap-4">

                                <RouterLink
                                        :to="`/shop/${item.product.id}`"
                                        class="h-24 w-[72px] shrink-0 cursor-pointer overflow-hidden bg-neutral-100 sm:h-28 sm:w-[84px]">

                                    <img
                                            v-if="item.product.images?.length"
                                            :src="item.product.images[0]"
                                            :alt="item.product.name"
                                            class="h-full w-full object-cover transition duration-300 hover:scale-[1.02]"/>

                                    <img
                                            v-else-if="item.product.image_url"
                                            :src="item.product.image_url"
                                            :alt="item.product.name"
                                            class="h-full w-full object-cover transition duration-300 hover:scale-[1.02]"/>

                                    <div
                                            v-else
                                            class="flex h-full items-center justify-center text-[10px] text-neutral-400">
                                        Нет изображения
                                    </div>

                                </RouterLink>

                                <div class="min-w-0 self-center">

                                    <RouterLink
                                            :to="`/shop/${item.product.id}`"
                                            class="cursor-pointer text-xs font-medium transition hover:underline sm:text-sm">
                                        {{ item.product.name }}
                                    </RouterLink>

                                    <div
                                            class="mt-1.5 space-y-0.5 text-[10px] text-neutral-400 sm:text-xs">

                                        <p v-if="item.color">
                                            {{ getColorName(item.color) }}
                                        </p>

                                        <p v-if="item.size">
                                            {{ item.size }}
                                        </p>

                                    </div>

                                </div>

                            </div>

                            <!-- PRICE -->
                            <div class="flex items-center justify-between text-xs md:block">

                                <span
                                      class="text-[10px] text-neutral-400 md:hidden">
                                Цена
                              </span>

                                <span>
                                {{ formatPrice(Number(item.product.price)) }}
                              </span>

                            </div>

                            <div class="flex items-center justify-between md:justify-start">

                                <span class="text-[10px] text-neutral-400 md:hidden">
                                  Количество
                                </span>

                                <div class="flex h-8 items-center border border-neutral-200">

                                    <button
                                            type="button"
                                            aria-label="Уменьшить количество"
                                            class="flex h-full w-8 cursor-pointer items-center justify-center text-sm
                                            text-neutral-400 transition hover:bg-neutral-100 hover:text-black"
                                            @click="cartStore.updateQuantity(item.id, item.quantity - 1)">
                                        −
                                    </button>

                                    <span class="flex h-full min-w-8 items-center justify-center border-x
                                    border-neutral-200 text-xs">
                                      {{ item.quantity }}
                                    </span>

                                    <button
                                            type="button"
                                            aria-label="Увеличить количество"
                                            class="flex h-full w-8 cursor-pointer items-center justify-center text-sm
                                            text-neutral-400 transition hover:bg-neutral-100 hover:text-black"
                                            @click="cartStore.updateQuantity(item.id, item.quantity + 1)">
                                        +
                                    </button>

                                </div>

                            </div>

                            <div class="flex items-center justify-between text-xs md:block">


                                <span class="text-[10px] text-neutral-400 md:hidden">
                                  Итого
                                </span>

                                <span>
                                   {{ formatPrice(Number(item.product.price) * item.quantity) }}
                                </span>

                            </div>

                            <button
                                    type="button"
                                    aria-label="Удалить товар"
                                    class="flex h-7 w-7 cursor-pointer items-center justify-center text-neutral-400 transition hover:text-black md:justify-self-end"
                                    @click="cartStore.removeFromCart(item.id)">

                                <X
                                        :size="14"
                                        :stroke-width="1.5"/>

                            </button>

                        </article>

                    </div>

                    <div class="mt-6 flex items-center gap-2">

                        <div class="relative w-full max-w-[300px]">

                            <input
                                    v-model="promoCode"
                                    type="text"
                                    placeholder="Промокод"
                                    :disabled="promoApplied"
                                    class="h-10 w-full border border-neutral-200 px-3 text-xs outline-none transition
                                    placeholder:text-neutral-400 focus:border-black disabled:bg-neutral-50"
                                    @keyup.enter="applyPromo"/>

                            <button
                                    v-if="promoApplied"
                                    type="button"
                                    aria-label="Удалить промокод"
                                    class="absolute right-2 top-1/2 flex -translate-y-1/2 cursor-pointer items-center
                                    justify-center text-neutral-400 transition hover:text-black"
                                    @click="removePromo">

                                <X :size="13"/>

                            </button>

                        </div>

                        <button
                                v-if="!promoApplied"
                                type="button"
                                class="h-10 cursor-pointer bg-black px-5 text-[10px] text-white transition hover:bg-neutral-800"
                                @click="applyPromo">
                            Применить
                        </button>

                        <span v-else
                              class="text-[10px] text-neutral-500">
                          Промокод применён
                        </span>

                    </div>

                </section>

                <aside class="h-fit border border-neutral-200">

                    <div class="p-5 sm:p-6">

                        <h2 class="text-sm font-medium">
                            Итого
                        </h2>

                        <!-- Products -->
                        <div class="mt-5 flex items-center justify-between text-xs">

                            <span class="text-neutral-500">
                              Товары
                            </span>

                            <span>
                              {{ formatPrice(cartStore.totalPrice) }}
                            </span>

                        </div>

                        <!-- Discount -->
                        <div class="mt-3 flex items-center justify-between text-xs">

                            <span class="text-neutral-500">
                              Скидка
                            </span>

                            <span>
                              —
                            </span>

                        </div>

                        <!-- Delivery -->
                        <div class="mt-3 flex items-center justify-between text-xs">

                            <span class="text-neutral-500">
                              Доставка
                            </span>

                            <span>
                              Бесплатно
                            </span>

                        </div>

                        <!-- TOTAL -->
                        <div class="mt-5 flex items-center justify-between border-t border-neutral-200 pt-5">

                            <span class="text-sm font-medium">
                              Итого к оплате
                            </span>

                            <span class="text-sm font-medium">
                              {{ formatPrice(cartStore.totalPrice) }}
                            </span>

                        </div>

                        <!-- CHECKOUT -->
                        <router-link
                                to="/checkout"
                                type="button"
                                class="mt-5 flex items-center justify-center w-full cursor-pointer bg-black px-5 py-3.5 text-xs text-white transition hover:bg-neutral-800">
                            Оформить заказ
                        </router-link>

                        <RouterLink
                                to="/shop"
                                class="mt-3 block cursor-pointer text-center text-[10px] text-neutral-500 transition hover:text-black">
                            Продолжить покупки
                        </RouterLink>

                    </div>

                    <div class="grid grid-cols-3 border-t border-neutral-200">

                        <div class="flex flex-col items-center px-2 py-4 text-center">

                            <Truck
                                    :size="17"
                                    :stroke-width="1.4"
                                    class="mb-2"/>

                            <p class="text-[9px] font-medium">
                                Быстрая доставка
                            </p>

                            <p
                                    class="mt-0.5 text-[8px] leading-3 text-neutral-400">
                                от 1 до 3 дней
                            </p>

                        </div>

                        <div
                                class="flex flex-col items-center border-x border-neutral-200 px-2 py-4 text-center">

                            <RefreshCcw
                                    :size="17"
                                    :stroke-width="1.4"
                                    class="mb-2"/>

                            <p class="text-[9px] font-medium">
                                Лёгкий возврат
                            </p>

                            <p
                                    class="mt-0.5 text-[8px] leading-3 text-neutral-400">
                                14 дней
                            </p>

                        </div>

                        <div
                                class="flex flex-col items-center px-2 py-4 text-center">

                            <ShieldCheck
                                    :size="17"
                                    :stroke-width="1.4"
                                    class="mb-2"/>

                            <p class="text-[9px] font-medium">
                                Безопасная оплата
                            </p>

                            <p
                                    class="mt-0.5 text-[8px] leading-3 text-neutral-400">
                                Защищённые платежи
                            </p>

                        </div>

                    </div>

                </aside>

            </div>

        </div>

    </main>
</template>