<script setup>
import {computed, onMounted, ref, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import SizeChart from "../components/shop/SizeChart.vue";
import {getProductById, getProductVariants,} from '../services/productsService'
import {useFavoritesStore} from '../stores/favorites'
import {formatPrice} from '../utils/formatPrice'
import {useCartStore} from '../stores/cart'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const favoritesStore = useFavoritesStore()

const isSizeChartOpen = ref(false)
const product = ref(null)
const variants = ref([])

const loading = ref(true)
const error = ref(null)

const currentImage = ref(0)

const selectedColor = ref(null)
const selectedSize = ref(null)

const categoryLabels = {
  't-shirts': 'Футболки',
  shirts: 'Рубашки',
  jackets: 'Жакеты и куртки',
  pants: 'Брюки',
  dresses: 'Платья',
  shoes: 'Обувь',
  accessories: 'Аксессуары',
  skirts: 'Юбки',
}

const colorMap = {
  beige: {
    name: 'Бежевый',
    hex: '#d8d0c4',
  },

  brown: {
    name: 'Коричневый',
    hex: '#8b7967',
  },

  black: {
    name: 'Чёрный',
    hex: '#111111',
  },

  white: {
    name: 'Белый',
    hex: '#eeeeee',
  },

  yellow: {
    name: 'Жёлтый',
    hex: '#f2c06b',
  },

  grey: {
    name: 'Серый',
    hex: '#9b9b9b',
  },

  blue: {
    name: 'Синий',
    hex: '#4f6d8a',
  },
}

const isFavorite = computed(() => {
  if (!product.value) {
    return false
  }

  return favoritesStore.isFavorite(product.value.id)
})

const toggleProductFavorite = async () => {
  if (!product.value) {
    return
  }

  const result = await favoritesStore.toggleFavorite(product.value.id)

  if (result.requiresAuth) {
    console.log('Нужно войти в аккаунт')
    return
  }

  if (!result.success) {
    console.error('Favorite error:', result.error)
  }
}

const getColorHex = (color) => {
  if (color?.startsWith('#')) {
    return color
  }
  return colorMap[color]?.hex || '#e5e5e5'
}

const getColorName = (color) => {
  return colorMap[color]?.name || color
}

const productImages = computed(() => {
  if (!product.value) {
    return []
  }

  if (product.value.images?.length) {
    return product.value.images
  }

  if (product.value.image_url) {
    return [product.value.image_url]
  }

  return []
})

const currentColor = computed(() => {
  if (!product.value) {
    return null
  }

  if (product.value.color) {
    return product.value.color
  }

  if (product.value.colors?.length) {
    return product.value.colors[0]
  }

  return null
})

const loadProduct = async () => {
  try {
    loading.value = true
    error.value = null

    currentImage.value = 0

    product.value = await getProductById(route.params.id)

    if (!product.value) {
      throw new Error('Product not found')
    }

    variants.value = await getProductVariants(product.value)

    if (product.value.colors?.length) {
      selectedColor.value = product.value.colors[0]
    } else {
      selectedColor.value = null
    }

    if (product.value.sizes?.length) {
      selectedSize.value = product.value.sizes[0]
    } else {
      selectedSize.value = null
    }

  } catch (err) {
    product.value = null
    variants.value = []
    error.value = 'Не удалось загрузить товар'
  } finally {
    loading.value = false
  }
}

const selectImage = (index) => {
  currentImage.value = index
}

const selectColor = async (color) => {
  selectedColor.value = color

  const variant = variants.value.find((item) => {
    return item.colors?.includes(color)
  })

  if (!variant) {
    console.warn('Variant not found for color:', color)
    return
  }

  await router.push({
    name: 'product',
    params: {id: variant.id}
  })
}

const selectSize = (size) => {
  selectedSize.value = size
}

const addToCart = () => {
  if (!product.value) {
    return
  }

  if (product.value.sizes?.length && !selectedSize.value) {
    return
  }

  if (product.value.color && !selectedColor.value) {
    return
  }

  cartStore.addToCart(
      product.value,
      selectedSize.value,
      selectedColor.value
  )
}

onMounted(async () => {
  await loadProduct()
})

watch(
    () => route.params.id,
    () => {
      loadProduct()
    }
)
</script>


<template>
  <main class="min-h-screen bg-white">

    <div
        v-if="loading"
        class="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-10">

      <div class="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(360px,0.7fr)]">

        <div class="flex gap-4">

          <div class="hidden w-20 shrink-0 flex-col gap-3 sm:flex">
            <div
                v-for="item in 4"
                :key="item"
                class="aspect-[3/4] animate-pulse bg-neutral-100"
            ></div>
          </div>

          <div class="aspect-[4/3] flex-1 animate-pulse bg-neutral-100"></div>

        </div>

        <div class="space-y-6 pt-4">

          <div class="h-3 w-20 animate-pulse bg-neutral-100"></div>

          <div class="h-10 w-3/4 animate-pulse bg-neutral-100"></div>

          <div class="h-6 w-28 animate-pulse bg-neutral-100"></div>

          <div class="h-px bg-neutral-100"></div>

          <div class="h-20 animate-pulse bg-neutral-100"></div>

          <div class="h-12 animate-pulse bg-neutral-100"></div>

        </div>

      </div>

    </div>

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

    <div
        v-else-if="product"
        class="mx-auto max-w-[1440px] px-5 pb-20 pt-6 sm:px-8 lg:px-10">

      <!-- Breadcrumbs -->
      <nav class="mb-8 flex flex-wrap items-center gap-2 text-xs text-neutral-400">

        <RouterLink
            to="/"
            class="cursor-pointer transition hover:text-black">
          Главная
        </RouterLink>

        <span>/</span>

        <RouterLink
            :to="{ path: '/shop', query: { gender: product.gender } }"
            class="cursor-pointer transition hover:text-black">
          {{ product.gender === 'women' ? 'Женщинам' : 'Мужчинам' }}
        </RouterLink>

        <span>/</span>

        <span class="text-neutral-500">
          {{ product.name }}
        </span>

      </nav>

      <!-- Main layout -->
      <div
          class="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(360px,0.7fr)]">

        <section class="flex gap-4">

          <!-- Desktop thumbnails -->
          <div
              v-if="productImages.length > 1"
              class="hidden w-20 shrink-0 flex-col gap-3 sm:flex">

            <button
                v-for="(image, index) in productImages"
                :key="image"
                type="button"
                class="aspect-[3/4] cursor-pointer overflow-hidden border transition"
                :class="
                currentImage === index  ? 'border-black' : 'border-transparent hover:border-neutral-300'"
                @click="selectImage(index)">

              <img
                  :src="image"
                  :alt="`${product.name} ${index + 1}`"
                  class="h-full w-full object-cover transition duration-300 hover:scale-105"/>

            </button>

          </div>

          <!-- Main image -->
          <div class="min-w-0 flex-1">

            <div
                class="aspect-[4/3] overflow-hidden bg-neutral-100">

              <img
                  v-if="productImages.length"
                  :src="productImages[currentImage]"
                  :alt="product.name"
                  class="h-full w-full object-contain"/>

              <div
                  v-else
                  class="flex h-full items-center justify-center text-sm text-neutral-400">
                Нет изображения
              </div>

            </div>

            <!-- Mobile thumbnails -->
            <div
                v-if="productImages.length > 1"
                class="mt-3 flex gap-2 overflow-x-auto sm:hidden">

              <button
                  v-for="(image, index) in productImages"
                  :key="image"
                  type="button"
                  class="h-20 w-16 shrink-0 cursor-pointer overflow-hidden border"
                  :class="
                  currentImage === index ? 'border-black' : 'border-neutral-200'"
                  @click="selectImage(index)">

                <img
                    :src="image"
                    :alt="`${product.name} ${index + 1}`"
                    class="h-full w-full object-cover"/>

              </button>

            </div>

          </div>

        </section>

        <section class="lg:sticky lg:top-24 lg:h-fit">

          <!-- Category -->
          <div
              v-if="product.category"
              class="mb-3 text-xs text-neutral-400">
            {{ categoryLabels[product.category] }}
          </div>

          <!-- Name -->
          <h1
              class="text-2xl font-normal tracking-tight sm:text-3xl">
            {{ product.name }}
          </h1>

          <!-- Price -->
          <div class="mt-3 text-lg font-medium">
            {{ formatPrice(product.price) }}
          </div>

          <div
              v-if="variants.length"
              class="mt-6">

            <div class="mb-3 flex items-center gap-2">

              <span class="text-sm font-medium">
                Цвет:
              </span>
              <span class="text-sm text-neutral-500">
              {{ getColorName(selectedColor) }}
              </span>

            </div>

            <div class="flex flex-wrap gap-3">

              <button
                  v-for="variant in variants"
                  :key="variant.id"
                  type="button"
                  class="relative h-7 w-7 cursor-pointer rounded-full border transition duration-200 hover:scale-110"
                  :class=" selectedColor === (variant.colors?.[0]) ? 'border-black ring-1 ring-black ring-offset-2'
                    : 'border-neutral-300 hover:border-black'"
                  :style="{backgroundColor: getColorHex(variant.colors?.[0])  }"
                  :title="getColorName(variant.colors?.[0])"
                  :aria-label="`Выбрать цвет ${getColorName(variant.colors?.[0])}`"
                  @click="selectColor(variant.colors?.[0])">
              </button>

            </div>

          </div>

          <!-- Size -->
          <div
              v-if="product.sizes?.length"
              class="mt-8 border-t border-neutral-200 pt-6">

            <div class="mb-4 flex items-center justify-between">

              <h2 class="text-sm font-medium">
                Размер:
              </h2>

              <button
                  type="button"
                  class="cursor-pointer text-xs text-neutral-500 underline underline-offset-4 transition hover:text-black"
                  @click="isSizeChartOpen = true">
                Таблица размеров
              </button>

            </div>

            <div class="flex flex-wrap gap-2">

              <button
                  v-for="size in product.sizes"
                  :key="size"
                  type="button"
                  class="min-w-12 cursor-pointer border px-4 py-3 text-xs transition"
                  :class="
                  selectedSize === size
                    ? 'border-black bg-black text-white'
                    : 'border-neutral-200 hover:border-black'"
                  @click="selectSize(size)">
                {{ size }}
              </button>

            </div>

          </div>

          <!-- Add to cart -->
          <div class="mt-8 flex gap-3">

            <button
                type="button"
                class="flex-1 cursor-pointer bg-black px-6 py-4 text-sm text-white transition hover:bg-neutral-800"
                @click="addToCart">
              Добавить в корзину
            </button>

            <button
                type="button"
                class="flex h-[52px] w-[52px] cursor-pointer items-center justify-center border border-neutral-200
                transition hover:border-black"
                :class="isFavorite ? 'border-black' : '' "
                :aria-label="favoritesStore.isFavorite(product.id)  ? 'Удалить из избранного' : 'Добавить в избранное'"
                @click="toggleProductFavorite">
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  :fill="isFavorite  ? 'black'  : 'none'"
                  stroke="currentColor"
                  stroke-width="1.5">
                <path
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12
                    21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"/>
              </svg>
            </button>
          </div>

          <!-- Description -->
          <div class="mt-8 border-t border-neutral-200">

            <details
                open
                class="group border-b border-neutral-200">

              <summary
                  class="flex cursor-pointer list-none items-center justify-between py-5 text-sm font-medium">

                <span>
                  Описание
                </span>

                <span class="text-lg transition group-open:rotate-45">
                  +
                </span>

              </summary>

              <div
                  v-if="product.description"
                  class="pb-5 text-sm leading-6 text-neutral-500">
                {{ product.description }}
              </div>

            </details>


            <details
                class="group border-b border-neutral-200">

              <summary
                  class="flex cursor-pointer list-none items-center justify-between py-5 text-sm font-medium">

                <span>
                  Состав и уход
                </span>

                <span class="text-lg">
                  +
                </span>

              </summary>

              <div class="pb-5 text-sm leading-6 text-neutral-500">
                Следуйте рекомендациям по уходу, указанным на этикетке товара.
              </div>

            </details>

            <details
                class="group border-b border-neutral-200">

              <summary
                  class="flex cursor-pointer list-none items-center justify-between py-5 text-sm font-medium">

                <span>
                  Доставка и возврат
                </span>

                <span class="text-lg">
                  +
                </span>

              </summary>

              <div class="pb-5 text-sm leading-6 text-neutral-500">
                Доставка от 1 до 3 дней. Возврат товара возможен в течение 14 дней.
              </div>

            </details>

          </div>

        </section>

      </div>

    </div>
    <SizeChart
        v-if="product"
        v-model="isSizeChartOpen"
        :gender="product.gender"/>
  </main>
</template>