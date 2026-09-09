<script setup>
import {computed, ref} from 'vue'
import {useRouter} from 'vue-router'
import {Check, MapPin} from 'lucide-vue-next'
import {useCartStore} from '../stores/cart'
import {useAddressesStore} from '../stores/addresses'
import {formatPrice} from '../utils/formatPrice'

const router = useRouter()

const cartStore = useCartStore()
const addressesStore = useAddressesStore()

const STORAGE_KEY = 'nova-delivery-method'

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

const savedMethod = localStorage.getItem(STORAGE_KEY)

const selectedMethod = ref(
    savedMethod || deliveryMethods[0].id
)

const currentMethod = computed(() => {
    return deliveryMethods.find(
        method => method.id === selectedMethod.value
    )
})

const selectMethod = (methodId) => {
    selectedMethod.value = methodId

    localStorage.setItem(
        STORAGE_KEY,
        methodId
    )
}

const continueToConfirmation = () => {
    if (!addressesStore.selectedAddress) {
        router.push('/checkout')
        return
    }

    localStorage.setItem(
        STORAGE_KEY,
        selectedMethod.value
    )

    router.push('/order-confirmation')
}

const goBack = () => {
    router.push('/checkout')
}
</script>

<template>
    <main class="min-h-screen bg-white">

        <div
                class="mx-auto max-w-[1440px] px-5 pb-20 pt-8 sm:px-8 lg:px-10">

            <div class="flex items-center gap-4">

                <h1
                        class="text-2xl font-normal tracking-tight sm:text-3xl">
                    Способ доставки
                </h1>

            </div>

            <div
                    class="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:gap-10">

                <section>

                    <div
                            v-if="addressesStore.selectedAddress"
                            class="border border-neutral-200 p-5">

                        <div class="flex items-start gap-3">

                            <MapPin
                                    :size="18"
                                    :stroke-width="1.5"
                                    class="mt-0.5 shrink-0"/>

                            <div>

                                <p class="text-sm font-medium">
                                    {{ addressesStore.selectedAddress.title }}
                                </p>

                                <p
                                        class="mt-2 text-xs leading-5 text-neutral-400">
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

                        </div>

                        <button
                                type="button"
                                class="mt-4 cursor-pointer text-xs underline underline-offset-4 transition hover:text-neutral-500"
                                @click="goBack">

                            Изменить адрес

                        </button>

                    </div>

                    <div
                            v-else
                            class="border border-neutral-200 p-6">

                        <p class="text-sm">
                            Адрес доставки не выбран
                        </p>

                        <button
                                type="button"
                                class="mt-4 cursor-pointer bg-black px-6 py-3 text-xs text-white transition hover:bg-neutral-800"
                                @click="goBack">

                            Выбрать адрес

                        </button>

                    </div>

                    <div class="mt-8">

                        <h2 class="text-lg font-medium">
                            Выберите способ доставки
                        </h2>

                        <div class="mt-5 space-y-3">
                            <button
                                    v-for="method in deliveryMethods"
                                    :key="method.id"
                                    type="button"
                                    class="flex w-full cursor-pointer items-center gap-4 border p-5 text-left transition"
                                    :class="selectedMethod === method.id ? 'border-black'
                                      : 'border-neutral-200 hover:border-neutral-400'"
                                    @click="selectMethod(method.id)">

                                <span
                                        class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border"
                                        :class="selectedMethod === method.id ? 'border-black' : 'border-neutral-300'">
                                  <span
                                          v-if="selectedMethod === method.id"
                                          class="h-2.5 w-2.5 rounded-full bg-black">
                                  </span>
                                </span>

                                <span class="min-w-0 flex-1">

                                    <span class="block text-sm font-medium">
                                        {{ method.title }}
                                    </span>

                                    <span class="mt-1 block text-xs text-neutral-400">
                                      {{ method.description }}
                                    </span>

                                    <span class="mt-2 block text-xs text-neutral-500">
                                      {{ method.time }}
                                    </span>

                                </span>

                                <span class="shrink-0 text-sm">
                                    {{ method.price === 0 ? 'Бесплатно' : formatPrice(method.price) }}
                                </span>

                            </button>

                        </div>

                    </div>

                    <div
                            class="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center">

                        <button
                                type="button"
                                class="h-11 cursor-pointer border border-neutral-200 px-8 text-xs transition
                                 hover:border-black"
                                @click="goBack">

                            Назад

                        </button>

                        <button
                                type="button"
                                class="h-11 cursor-pointer bg-black px-8 text-xs text-white transition
                                hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
                                :disabled="!addressesStore.selectedAddress"
                                @click="continueToConfirmation">

                            Продолжить

                        </button>

                    </div>

                </section>

                <aside
                        class="h-fit border border-neutral-200">

                    <div class="p-5 sm:p-6">

                        <h2 class="text-sm font-medium">
                            Ваш заказ
                        </h2>

                        <div class="mt-5 space-y-4">

                            <div
                                    v-for="item in cartStore.items"
                                    :key="item.id"
                                    class="flex gap-3">

                                <div
                                        class="h-16 w-12 shrink-0 overflow-hidden bg-neutral-100">

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
                                    <p
                                            class="truncate text-xs">
                                        {{ item.product.name }}
                                    </p>

                                    <p
                                            class="mt-1 text-[10px] text-neutral-400">

                                        {{ item.size }}

                                        <span v-if="item.color">
                                            · {{ item.color }}
                                        </span>

                                        · {{ item.quantity }} шт.

                                    </p>

                                </div>


                                <span
                                        class="shrink-0 text-xs">
                                    {{  formatPrice(Number(item.product.price) *  item.quantity) }}

                                </span>

                            </div>

                        </div>

                        <div class="mt-6 border-t border-neutral-200 pt-5">

                            <div class="flex justify-between text-xs">

                                <span class="text-neutral-500">
                                  Товары
                                </span>

                                <span>
                                  {{ formatPrice(cartStore.totalPrice) }}
                                </span>

                            </div>

                            <div
                                    class="mt-3 flex justify-between text-xs">

                                <span class="text-neutral-500">
                                  Доставка
                                </span>

                                <span>
                                    {{  currentMethod?.price === 0 ? 'Бесплатно' : formatPrice(currentMethod?.price) }}
                                </span>

                            </div>

                            <div
                                    class="mt-5 flex justify-between border-t border-neutral-200 pt-5">

                                    <span class="text-sm font-medium">
                                      Итого
                                    </span>

                                <span class="text-sm font-medium">
                                    {{      formatPrice( cartStore.totalPrice +(currentMethod?.price || 0)) }}
                                </span>

                            </div>

                        </div>

                    </div>

                    <div
                            class="grid grid-cols-3 border-t border-neutral-200">

                        <div
                                class="flex flex-col items-center px-2 py-4 text-center">

                            <Check
                                    :size="17"
                                    :stroke-width="1.4"
                                    class="mb-2"/>

                            <p class="text-[9px] font-medium">
                                Бесплатно
                            </p>

                            <p class="mt-0.5 text-[8px] text-neutral-400">
                                доставка
                            </p>

                        </div>

                        <div
                                class="flex flex-col items-center border-x border-neutral-200 px-2 py-4 text-center">

                            <Check
                                    :size="17"
                                    :stroke-width="1.4"
                                    class="mb-2"/>

                            <p class="text-[9px] font-medium">
                                Быстро
                            </p>

                            <p
                                class="mt-0.5 text-[8px] text-neutral-400">
                                1–4 дня
                            </p>

                        </div>


                        <div class="flex flex-col items-center px-2 py-4 text-center">

                            <Check
                                    :size="17"
                                    :stroke-width="1.4"
                                    class="mb-2"/>

                            <p class="text-[9px] font-medium">
                                Надёжно
                            </p>

                            <p
                                    class="mt-0.5 text-[8px] text-neutral-400">
                                до двери
                            </p>

                        </div>

                    </div>

                </aside>

            </div>

        </div>

    </main>
</template>