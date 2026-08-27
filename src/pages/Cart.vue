<script setup>
import { useCartStore } from '../stores/cart'
import { formatPrice } from '../utils/formatPrice'

const cartStore = useCartStore()
</script>

<template>
  <main class="min-h-screen bg-white">

    <div
        class="mx-auto max-w-[1440px] px-5 pb-20 pt-8 sm:px-8 lg:px-10">

      <!-- Breadcrumbs -->
      <nav class="mb-10 flex items-center gap-2 text-xs text-neutral-400">

        <RouterLink
            to="/"
            class="transition hover:text-black">
          Главная
        </RouterLink>

        <span>/</span>

        <span class="text-neutral-500">
          Корзина
        </span>

      </nav>

      <h1 class="text-3xl font-normal tracking-tight sm:text-4xl">
        Корзина
      </h1>


      <!-- Empty -->
      <div
          v-if="!cartStore.items.length"
          class="flex min-h-[400px] flex-col items-center justify-center text-center">

        <h2 class="text-xl">
          Ваша корзина пуста
        </h2>

        <p class="mt-3 text-sm text-neutral-400">
          Добавьте товары, чтобы оформить заказ
        </p>

        <RouterLink
            to="/shop"
            class="mt-8 bg-black px-8 py-4 text-sm text-white"
        >
          Перейти в магазин
        </RouterLink>

      </div>


      <!-- Cart -->
      <div
          v-else
          class="mt-10 grid gap-12 lg:grid-cols-[1fr_360px]">

        <!-- Items -->
        <section class="space-y-6">

          <article
              v-for="item in cartStore.items"
              :key="item.id"
              class="flex gap-5 border-b border-neutral-200 pb-6">

            <div class="h-32 w-24 shrink-0 bg-neutral-100">

              <img
                  v-if="item.product.images?.length"
                  :src="item.product.images[0]"
                  :alt="item.product.name"
                  class="h-full w-full object-cover"
              />

            </div>

            <div class="flex min-w-0 flex-1 flex-col">

              <div class="flex justify-between gap-4">

                <div>

                  <h2 class="text-sm">
                    {{ item.product.name }}
                  </h2>

                  <p class="mt-2 text-xs text-neutral-400">
                    Цвет: {{ item.color }}
                  </p>

                  <p class="mt-1 text-xs text-neutral-400">
                    Размер: {{ item.size }}
                  </p>

                </div>

                <p class="text-sm font-medium">
                  {{ formatPrice(item.product.price * item.quantity) }}
                </p>

              </div>

              <div class="mt-auto flex items-center gap-4">

                <button
                    type="button"
                    class="h-8 w-8 border border-neutral-200"
                    @click="cartStore.updateQuantity(item.id,item.quantity - 1)">
                  −
                </button>

                <span class="text-sm">
                  {{ item.quantity }}
                </span>

                <button
                    type="button"
                    class="h-8 w-8 border border-neutral-200"
                    @click="cartStore.updateQuantity(item.id,item.quantity + 1)">
                  +
                </button>

                <button
                    type="button"
                    class="ml-4 text-xs text-neutral-400 underline-offset-4 hover:text-black hover:underline"
                    @click="cartStore.removeFromCart(item.id)">
                  Удалить
                </button>

              </div>

            </div>

          </article>

        </section>

        <!-- Summary -->
        <aside class="h-fit border border-neutral-200 p-6">

          <h2 class="text-lg">
            Итого
          </h2>

          <div class="mt-6 flex justify-between text-sm">

            <span class="text-neutral-500">
              Товары
            </span>

            <span>
              {{ formatPrice(cartStore.totalPrice) }}
            </span>

          </div>

          <div class="mt-3 flex justify-between text-sm">

            <span class="text-neutral-500">
              Доставка
            </span>

            <span>
              Бесплатно
            </span>

          </div>

          <div class="mt-6 flex justify-between border-t border-neutral-200 pt-6">

            <span class="font-medium">
              Итого
            </span>

            <span class="font-medium">
              {{ formatPrice(cartStore.totalPrice) }}
            </span>

          </div>

          <button
              type="button"
              class="mt-6 w-full bg-black px-6 py-4 text-sm text-white transition hover:bg-neutral-800">
            Оформить заказ
          </button>

        </aside>

      </div>

    </div>

  </main>
</template>