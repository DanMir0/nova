<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

const route = useRoute()

const orderId = computed(() => route.query.order)
</script>

<template>
    <main class="mx-auto max-w-5xl px-6 py-20">
        <div class="mx-auto max-w-xl text-center">

            <div class="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-neutral-300">
                <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        class="h-7 w-7">
                    <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="m4.5 12.75 6 6 9-13.5"/>
                </svg>
            </div>

            <p class="mb-3 text-xs uppercase tracking-[0.2em] text-neutral-500">
                Nova
            </p>

            <h1 class="text-3xl font-light tracking-tight">
                Заказ оформлен
            </h1>

            <p class="mt-5 text-sm leading-6 text-neutral-600">
                Спасибо за заказ. Мы получили ваши данные
                и начали обработку заказа.
            </p>

            <div v-if="orderId"
                 class="mt-8 border-y border-neutral-200 py-5">
                <p class="text-xs uppercase tracking-wider text-neutral-500">
                    Номер заказа
                </p>

                <p class="mt-2 break-all text-sm">
                    {{ orderId }}
                </p>
            </div>

            <div class="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <RouterLink
                        to="/shop"
                        class="cursor-pointer bg-neutral-950 px-7 py-4 text-xs uppercase tracking-wider text-white transition-opacity hover:opacity-80">
                    Продолжить покупки
                </RouterLink>

                <RouterLink
                        to="/account"
                        class="cursor-pointer border border-neutral-300 px-7 py-4 text-xs uppercase tracking-wider text-neutral-950 transition-colors hover:border-neutral-950">
                    Мой аккаунт
                </RouterLink>
            </div>

        </div>
    </main>
</template>