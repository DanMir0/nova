<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getProductById } from '../services/productsService'
import { formatPrice } from '../utils/formatPrice'
import { useCartStore } from '../stores/cart'

const route = useRoute()
const cartStore = useCartStore()

const product = ref(null)
const loading = ref(true)
const error = ref(null)

const currentImage = ref(0)

const selectedColor = ref(null)
const selectedSize = ref(null)

const loadProduct = async () => {
  try {
    loading.value = true
    error.value = null

    product.value = await getProductById(route.params.id)

    if (product.value?.colors?.length) {
      selectedColor.value = product.value.colors[0]
    }

    if (product.value?.sizes?.length) {
      selectedSize.value = product.value.sizes[0]
    }

  } catch (err) {
    console.error('Product error:', err)

    error.value = 'Не удалось загрузить товар'
  } finally {
    loading.value = false
  }
}

const addToCart = () => {
  if (!product.value) return

  if (product.value.sizes?.length && !selectedSize.value) {
    return
  }

  if (product.value.colors?.length && !selectedColor.value) {
    return
  }

  cartStore.addToCart(
      product.value,
      selectedSize.value,
      selectedColor.value
  )
}

onMounted(() => {
  loadProduct()
})
</script>

<template>
  <main class="min-h-screen bg-white">

    <!-- Loading -->
    <div
        v-if="loading"
        class="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-10">
      <div class="grid animate-pulse gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.6fr)]">

        <div class="aspect-[4/5] bg-neutral-100"></div>

        <div class="space-y-6">
          <div class="h-8 w-3/4 bg-neutral-100"></div>
          <div class="h-6 w-32 bg-neutral-100"></div>
          <div class="h-20 bg-neutral-100"></div>
          <div class="h-12 bg-neutral-100"></div>
        </div>

      </div>
    </div>

    <!-- Error -->
    <div
        v-else-if="error"
        class="mx-auto max-w-[1440px] px-5 py-20 text-center">
      <h1 class="text-2xl">
        {{ error }}
      </h1>

      <RouterLink
          to="/shop"
          class="mt-6 inline-block text-sm underline">
        Вернуться в магазин
      </RouterLink>
    </div>

    <!-- Product -->
    <div
        v-else-if="product"
        class="mx-auto max-w-[1440px] px-5 pb-20 pt-6 sm:px-8 lg:px-10">

      <!-- Breadcrumbs -->
      <nav class="mb-8 flex items-center gap-2 text-xs text-neutral-400">

        <RouterLink
            to="/"
            class="transition hover:text-black">
          Главная
        </RouterLink>

        <span>/</span>

        <RouterLink
            to="/shop"
            class="transition hover:text-black">
          Магазин
        </RouterLink>

        <span>/</span>

        <span class="text-neutral-500">
          {{ product.name }}
        </span>

      </nav>


      <div class="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.6fr)]">

        <section class="flex gap-4">

          <!-- Thumbnails -->
          <div
              v-if="product.images?.length > 1"
              class="hidden w-20 shrink-0 flex-col gap-3 sm:flex">

            <button
                v-for="(image, index) in product.images"
                :key="image"
                type="button"
                class="aspect-[3/4] overflow-hidden border transition"
                :class="currentImage === index ? 'border-black' : 'border-transparent'"
                @click="currentImage = index">
              <img
                  :src="image"
                  :alt="`${product.name} ${index + 1}`"
                  class="h-full w-full object-cover"
              />
            </button>

          </div>

          <!-- Main image -->
          <div class="min-w-0 flex-1">

            <div class="aspect-[4/5] overflow-hidden bg-neutral-100">

              <img
                  v-if="product.images?.length"
                  :src="product.images[currentImage]"
                  :alt="product.name"
                  class="h-full w-full object-cover"/>

              <img
                  v-else-if="product.image_url"
                  :src="product.image_url"
                  :alt="product.name"
                  class="h-full w-full object-cover"/>

              <div
                  v-else
                  class="flex h-full items-center justify-center text-sm text-neutral-400">
                Нет изображения
              </div>

            </div>

            <!-- Mobile thumbnails -->
            <div
                v-if="product.images?.length > 1"
                class="mt-3 flex gap-2 overflow-x-auto sm:hidden">

              <button
                  v-for="(image, index) in product.images"
                  :key="image"
                  type="button"
                  class="h-20 w-16 shrink-0 overflow-hidden border"
                  :class="currentImage === index ? 'border-black' : 'border-neutral-200'"
                  @click="currentImage = index">
                <img
                    :src="image"
                    :alt="`${product.name} ${index + 1}`"
                    class="h-full w-full object-cover"
                />
              </button>

            </div>

          </div>

        </section>

        <section class="lg:sticky lg:top-24 lg:h-fit">

          <!-- Category -->
          <div
              v-if="product.category"
              class="mb-3 text-xs uppercase tracking-[0.15em] text-neutral-400">
            {{ product.category }}
          </div>

          <!-- Name -->
          <h1 class="text-3xl font-normal tracking-tight sm:text-4xl">
            {{ product.name }}
          </h1>

          <!-- Price -->
          <div class="mt-5 text-xl font-medium">
            {{ formatPrice(product.price) }}
          </div>

          <!-- Description -->
          <div
              v-if="product.description"
              class="mt-8 border-t border-neutral-200 pt-8">
            <h2 class="mb-3 text-sm font-medium">
              Описание
            </h2>

            <p class="text-sm leading-7 text-neutral-500">
              {{ product.description }}
            </p>
          </div>

          <!-- Colors -->
          <div
              v-if="product.colors?.length"
              class="mt-8 border-t border-neutral-200 pt-8">

            <div class="mb-4 flex items-center justify-between">

              <h2 class="text-sm font-medium">
                Цвет
              </h2>

              <span class="text-xs text-neutral-400">
                {{ selectedColor }}
              </span>

            </div>

            <div class="flex flex-wrap gap-3">

              <button
                  v-for="color in product.colors"
                  :key="color"
                  type="button"
                  class="rounded-full border px-4 py-2 text-xs transition"
                  :class="selectedColor === color ? 'border-black bg-black text-white' : 'border-neutral-200 hover:border-black'"
                  @click="selectedColor = color">
                {{ color }}
              </button>

            </div>

          </div>

          <!-- Sizes -->
          <div
              v-if="product.sizes?.length"
              class="mt-8 border-t border-neutral-200 pt-8">

            <div class="mb-4 flex items-center justify-between">

              <h2 class="text-sm font-medium">
                Размер
              </h2>

            </div>


            <div class="flex flex-wrap gap-2">

              <button
                  v-for="size in product.sizes"
                  :key="size"
                  type="button"
                  class="min-w-12 border px-4 py-3 text-xs transition"
                  :class="selectedSize === size ? 'border-black bg-black text-white' : 'border-neutral-200 hover:border-black'"
                  @click="selectedSize = size">
                {{ size }}
              </button>

            </div>

          </div>

          <!-- Add to cart -->
          <button
              type="button"
              class="mt-8 w-full bg-black px-6 py-4 text-sm text-white transition hover:bg-neutral-800"
              @click="addToCart">
            Добавить в корзину
          </button>


          <!-- Additional info -->
          <div class="mt-8 space-y-4 border-t border-neutral-200 pt-8 text-xs text-neutral-500">

            <div class="flex justify-between">
              <span>Доставка</span>
              <span>1–3 дня</span>
            </div>

            <div class="flex justify-between">
              <span>Возврат</span>
              <span>14 дней</span>
            </div>

          </div>

        </section>

      </div>

    </div>

  </main>
</template>