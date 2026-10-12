<script setup>
import {computed, ref} from 'vue'
import {RouterLink} from 'vue-router'
import {MapPin, ArrowLeft, ArrowRight, Check} from 'lucide-vue-next'
import {useAddressesStore} from '../stores/addresses'
import {useCartStore} from '../stores/cart'
import {formatPrice} from '../utils/formatPrice'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'
import { createOrder } from '../services/orders'

const addressesStore = useAddressesStore()
const cartStore = useCartStore()

const router = useRouter()

const isSubmitting = ref(false)
const orderError = ref('')
const orderCreated = ref(false)

const step = ref(1)

const selectedAddress = computed(() => {
  return addressesStore.selectedAddress
})

const canContinue = computed(() => {
  return Boolean(
      selectedAddress.value &&
      cartStore.items.length
  )
})

const handleCreateOrder = async () => {
  orderError.value = ''

  if (isSubmitting.value) return

  if (!cartStore.items.length) {
    orderError.value = 'Корзина пуста'
    return
  }

  if (!addressesStore.selectedAddress) {
    step.value = 1
    orderError.value = 'Выберите адрес доставки'
    return
  }

  isSubmitting.value = true

  try {
    const { data: { user }, error: authError } =
        await supabase.auth.getUser()

    if (authError) throw authError

    if (!user) {
      orderError.value =
          'Войдите в аккаунт, чтобы оформить заказ'
      return
    }

    const order = await createOrder({
      cartItems: cartStore.items,
      address: addressesStore.selectedAddress,
      deliveryMethod: 'courier',
      deliveryPrice: 0,
      promoCode: cartStore.promo?.code ?? null,
    })

    orderCreated.value = true

    cartStore.clearCart()

    await router.push({
      path: '/order-success',
      query: { order: order.id },
    })
  } catch (error) {
    console.error('Create order error:', error)

    orderError.value =
        error.message || 'Не удалось оформить заказ. Попробуйте ещё раз.'
  } finally {
    isSubmitting.value = false
  }
}

const continueToReview = () => {
  if (!canContinue.value) return

  step.value = 2
}

const backToAddress = () => {
  step.value = 1
}
</script>

<template>
  <main class="min-h-screen bg-white">
    <div class="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <RouterLink
          to="/cart"
          class="inline-flex items-center gap-2 text-xs text-neutral-500 transition hover:text-black">

        <ArrowLeft :size="15"/>
        Вернуться в корзину
      </RouterLink>

      <h1 class="mt-5 text-2xl font-normal tracking-tight sm:text-3xl">
        Оформление заказа
      </h1>

      <!-- Stages -->
      <div class="mt-7 flex items-center gap-3 text-xs">
        <div class="flex items-center gap-2" :class="step === 1 ? 'text-black' : 'text-neutral-400'">
          <span
              class="flex h-7 w-7 items-center justify-center rounded-full border"
              :class="step === 1 ? 'border-black bg-black text-white' : 'border-neutral-300'">
            <Check v-if="step > 1" :size="14"/>
            <span v-else>1</span>
          </span>
          Доставка
        </div>

        <div class="h-px flex-1 bg-neutral-200"/>

        <div class="flex items-center gap-2" :class="step === 2 ? 'text-black' : 'text-neutral-400'">
          <span
              class="flex h-7 w-7 items-center justify-center rounded-full border"
              :class="step === 2 ? 'border-black bg-black text-white' : 'border-neutral-300'">
            2
          </span>
          Подтверждение
        </div>
      </div>

      <div class="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section class="min-w-0">
          <!-- Stage 1: choice address -->
          <div v-if="step === 1">
            <h2 class="text-lg font-medium">
              Адрес доставки
            </h2>

            <p class="mt-2 text-sm text-neutral-500">
              Выберите адрес, на который доставить заказ.
            </p>

            <div v-if="!addressesStore.addresses.length"
                 class="mt-5 border border-neutral-200 p-5">

              <p class="text-sm">
                У вас пока нет сохранённых адресов.
              </p>

              <p class="mt-2 text-xs leading-5 text-neutral-500">
                Сначала добавьте адрес в личном кабинете.
              </p>

              <RouterLink to="/account"
                          class="mt-5 inline-flex items-center gap-2 bg-black px-5 py-3 text-xs text-white transition hover:bg-neutral-800">
                Добавить адрес
                <ArrowRight :size="14"/>
              </RouterLink>
            </div>

            <div v-else class="mt-5 space-y-3">
              <button
                  v-for="address in addressesStore.addresses"
                  :key="address.id"
                  type="button"
                  class="w-full border p-4 text-left transition sm:p-5"
                  :class="addressesStore.selectedAddressId === address.id ? 'border-black' : 'border-neutral-200 ' +
                   'hover:border-neutral-400'"
                  @click="addressesStore.selectAddress(address.id)">
                <div class="flex items-start gap-3">
                  <span class="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border"
                        :class="addressesStore.selectedAddressId === address.id ? 'border-black' : 'border-neutral-300'">
                    <span
                        v-if="addressesStore.selectedAddressId === address.id"
                        class="h-2 w-2 rounded-full bg-black"/>
                  </span>

                  <div class="min-w-0 flex-1">
                    <div class="flex flex-wrap items-center gap-2">
                      <h3 class="text-sm font-medium">
                        {{ address.title }}
                      </h3>

                      <span v-if="address.isDefault" class="text-[10px] text-neutral-400">
                        Основной
                      </span>
                    </div>

                    <p class="mt-2 text-xs leading-5 text-neutral-500">
                      {{ address.city }}, {{ address.address }}
                    </p>

                    <p class="mt-1 text-xs text-neutral-500">
                      {{ address.recipient }}
                    </p>

                    <p class="mt-1 text-xs text-neutral-500">
                      {{ address.phone }}
                    </p>
                  </div>

                  <MapPin
                      v-if="addressesStore.selectedAddressId === address.id"
                      :size="17"
                      class="shrink-0"/>
                </div>
              </button>
            </div>

            <button
                v-if="addressesStore.addresses.length"
                type="button"
                :disabled="!canContinue"
                class="mt-6 flex w-full items-center justify-center gap-2 bg-black px-5 py-4 text-xs text-white
                transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300 sm:w-auto sm:min-w-56"
                @click="continueToReview">
              Продолжить
              <ArrowRight :size="15"/>
            </button>
          </div>

          <!-- Stage 2: order verification -->
          <div v-else>
            <h2 class="text-lg font-medium">
              Проверьте заказ
            </h2>

            <p class="mt-2 text-sm text-neutral-500">
              Убедитесь, что адрес и товары указаны правильно.
            </p>

            <div class="mt-5 border border-neutral-200 p-5">
              <div class="flex items-center justify-between gap-3">
                <h3 class="text-sm font-medium">
                  Адрес доставки
                </h3>

                <button
                    type="button"
                    class="text-xs text-neutral-500 underline hover:text-black"
                    @click="backToAddress">
                  Изменить
                </button>
              </div>

              <template v-if="selectedAddress">
                <p class="mt-3 text-sm">
                  {{ selectedAddress.title }}
                </p>

                <p class="mt-1 text-xs leading-5 text-neutral-500">
                  {{ selectedAddress.city }},
                  {{ selectedAddress.address }}
                </p>

                <p class="mt-2 text-xs text-neutral-500">
                  {{ selectedAddress.recipient }}
                </p>

                <p class="mt-1 text-xs text-neutral-500">
                  {{ selectedAddress.phone }}
                </p>
              </template>
            </div>

            <div class="mt-5 border border-neutral-200 p-5">
              <h3 class="text-sm font-medium">
                Товары в заказе
              </h3>

              <div v-for="item in cartStore.items"
                  :key="item.id"
                  class="flex gap-4 border-b border-neutral-100 py-4 last:border-b-0 last:pb-0">
                <img v-if="item.product.images?.length"
                    :src="item.product.images[0]"
                    :alt="item.product.name"
                    class="h-20 w-16 shrink-0 bg-neutral-100 object-cover"/>

                <img v-else-if="item.product.image_url"
                    :src="item.product.image_url"
                    :alt="item.product.name"
                    class="h-20 w-16 shrink-0 bg-neutral-100 object-cover"/>

                <div class="min-w-0 flex-1">
                  <p class="text-sm">
                    {{ item.product.name }}
                  </p>

                  <p class="mt-1 text-xs text-neutral-500">
                    Количество: {{ item.quantity }}
                  </p>

                  <p v-if="item.size || item.color"
                      class="mt-1 text-xs text-neutral-500">
                    {{ item.size }}
                    {{ item.color ? ` · ${item.color}` : '' }}
                  </p>
                </div>

                <p class="shrink-0 text-xs">
                  {{ formatPrice(Number(item.product.price) * item.quantity) }}
                </p>
              </div>
            </div>

            <button
                type="button"
                class="mt-6 flex w-full items-center justify-center gap-2 border border-neutral-300 px-5 py-4 text-xs
                transition hover:border-black sm:w-auto"
                @click="backToAddress">
              <ArrowLeft :size="15"/>
              Вернуться к адресу
            </button>

            <div
                v-if="orderError"
                role="alert"
                class="mt-5 border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {{ orderError }}

              <RouterLink
                  v-if="orderError.includes('Войдите в аккаунт')"
                  to="/account"
                  class="ml-1 underline">
                Перейти в аккаунт
              </RouterLink>
            </div>

            <button type="button"
                :disabled="isSubmitting || orderCreated || !cartStore.items.length"
                class="mt-5 flex w-full items-center justify-center gap-2 bg-black px-5 py-4 text-xs text-white
                transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400 sm:w-auto sm:min-w-56"
                @click="handleCreateOrder">
              <span v-if="isSubmitting">
                  Оформляем заказ...
              </span>

              <span v-else>
                  Подтвердить заказ
              </span>

              <ArrowRight v-if="!isSubmitting" :size="15" />
            </button>

            <p class="mt-4 text-xs leading-5 text-neutral-500">
              Проверьте информацию перед завершением оформления.
            </p>
          </div>
        </section>

        <!-- Summary -->
        <aside class="h-fit border border-neutral-200 p-5 sm:p-6">
          <h2 class="text-sm font-medium">
            Ваш заказ
          </h2>

          <div class="mt-5 flex items-center justify-between gap-3 text-xs">
            <span class="text-neutral-500">
                Количество товаров
            </span>

            <span>
              {{ cartStore.totalItems }}
            </span>
          </div>

          <div class="mt-3 flex items-center justify-between gap-3 text-xs">
            <span class="text-neutral-500">
              Товары
            </span>

            <span>
              {{ formatPrice(cartStore.totalPrice) }}
           </span>
          </div>

          <!--promo -->
          <div class="mt-3 flex items-center justify-between gap-3 text-xs">
            <span class="text-neutral-500">
                Промокод
                <span v-if="cartStore.promo">
                    ({{ cartStore.promo.code }})
                </span>
            </span>

            <span :class="cartStore.discountAmount > 0 ? 'text-green-700' : ''">
              {{ cartStore.discountAmount > 0 ? `−${formatPrice(cartStore.discountAmount)}` : '—' }}
           </span>
          </div>

          <!-- Delivery-->
          <div class="mt-3 flex items-center justify-between gap-3 text-xs">
            <span class="text-neutral-500">
                Доставка
            </span>

            <span>Бесплатно</span>
          </div>

          <!-- Total -->
          <div class="mt-5 flex items-center justify-between gap-3 border-t border-neutral-200 pt-5">
            <span class="text-sm font-medium">
                Итого
            </span>

            <span class="text-sm font-medium">
              {{ formatPrice(cartStore.finalTotal) }}
            </span>
          </div>

          <RouterLink to="/cart"
              class="mt-5 block text-center text-xs text-neutral-500 underline transition hover:text-black">
            Вернуться в корзину
          </RouterLink>
        </aside>

      </div>
    </div>
  </main>
</template>