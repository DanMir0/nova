<script setup>
import {ref, onMounted, computed, onBeforeUnmount, watch} from 'vue'
import {
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../services/adminProducts.js'
import { uploadProductImage } from '../../services/productImages.js'
import AdminDeleteModal from "../../components/admin/AdminDeleteModal.vue";

const products = ref([])
const loading = ref(false)
const saving = ref(false)
const error = ref('')
const success = ref('')

const showDeleteModal = ref(false)
const productToDelete = ref(null)
const deleting = ref(false)

const showForm = ref(false)
const editingId = ref(null)

const selectedImageFiles = ref([])
const imagePreviews = ref([])
const existingImages = ref([])

const searchQuery = ref('')
const filterCategory = ref('')
const filterGender = ref('')
const filterCollection = ref('')
const filterStatus = ref('all')
const sortBy = ref('newest')

const filteredProducts = computed(() => {
  let result = [...products.value]

  const search = searchQuery.value.trim().toLowerCase()

  if (search) {
    result = result.filter((product) =>
        [product.name, product.slug]
            .some((value) => value?.toLowerCase().includes(search))
    )
  }

  if (filterCategory.value) {
    result = result.filter(
        (product) => product.category === filterCategory.value
    )
  }

  if (filterGender.value) {
    result = result.filter(
        (product) => product.gender === filterGender.value
    )
  }

  if (filterCollection.value) {
    result = result.filter(
        (product) => product.collection === filterCollection.value
    )
  }

  if (filterStatus.value === 'active') {
    result = result.filter((product) => product.is_active)
  } else if (filterStatus.value === 'hidden') {
    result = result.filter((product) => !product.is_active)
  }

  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'name-asc':
        return (a.name ?? '').localeCompare(b.name ?? '', 'ru')

      case 'name-desc':
        return (b.name ?? '').localeCompare(a.name ?? '', 'ru')

      case 'price-asc':
        return Number(a.price) - Number(b.price)

      case 'price-desc':
        return Number(b.price) - Number(a.price)

      case 'oldest':
        return new Date(a.created_at) - new Date(b.created_at)

      case 'newest':
      default:
        return new Date(b.created_at) - new Date(a.created_at)
    }
  })

  return result
})

const currentPage = ref(1)
const pageSize = 10

const totalPages = computed(() =>
    Math.ceil(filteredProducts.value.length / pageSize)
)

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize

  return filteredProducts.value.slice(start, start + pageSize)
})

function goToPage(page) {
  if (page < 1 || page > totalPages.value) return

  currentPage.value = page
}

const resetImageSelection = () => {
  imagePreviews.value.forEach((url) => URL.revokeObjectURL(url))

  imagePreviews.value = []
  selectedImageFiles.value = []
}

const uploadingImage = ref(false)

const collectionOptions = [
  { value: 'spring-summer', label: 'Весна/Лето' },
  { value: 'fall-winter', label: 'Осень/Зима' },
]

const categoryOptions = [
  { value: 'pants', label: 'Брюки' },
  { value: 'shirts', label: 'Рубашки' },
  { value: 't-shirts', label: 'Футболки' },
  { value: 'outerwear', label: 'Верхняя одежда' },
  { value: 'dresses', label: 'Платья' },
  { value: 'skirts', label: 'Юбки' },
  { value: 'knitwear', label: 'Трикотаж' },
  { value: 'jeans', label: 'Джинсы' },
]

const colorOptions = [
  { value: 'black', label: 'Чёрный', hex: '#171717' },
  { value: 'white', label: 'Белый', hex: '#ffffff' },
  { value: 'grey', label: 'Серый', hex: '#9b9b9b' },
  { value: 'brown', label: 'Коричневый', hex: '#8b7967' },
  { value: 'beige', label: 'Бежевый', hex: '#d8d0c4' },
  { value: 'yellow', label: 'Жёлтый', hex: '#f2c06b' },
  { value: 'blue', label: 'Синий', hex: '#4f6d8a' },
]

const selectedColor = ref('black')

const selectedColorLabel = computed(() =>
    colorOptions.find((color) => color.value === selectedColor.value)?.label ?? ''
)

const variantGroups = computed(() => {
  const groups = new Map()

  products.value.forEach((product) => {
    if (product.variant_group_id) {
      if (!groups.has(product.variant_group_id)) {
        groups.set(product.variant_group_id, {
          id: product.variant_group_id,
          name: product.name,
        })
      }
    }
  })

  return [...groups.values()]
})

const selectedVariantGroup = ref('')
const createVariantGroup = ref(false)

const handleImageChange = (event) => {
  resetImageSelection()

  const files = Array.from(event.target.files ?? [])

  const invalidFile = files.find((file) => {
    return !file.type.startsWith('image/') ||
        file.size > 5 * 1024 * 1024
  })

  if (invalidFile) {
    error.value = 'Выбирай изображения размером не более 5 МБ каждое.'
    event.target.value = ''
    return
  }

  error.value = ''
  selectedImageFiles.value = files
  imagePreviews.value = files.map((file) => URL.createObjectURL(file))

  event.target.value = ''
}

const removeNewImage = (index) => {
  URL.revokeObjectURL(imagePreviews.value[index])

  imagePreviews.value.splice(index, 1)
  selectedImageFiles.value.splice(index, 1)
}

const removeExistingImage = (index) => {
  existingImages.value.splice(index, 1)
}

onBeforeUnmount(resetImageSelection)

const emptyForm = () => ({
  name: '',
  slug: '',
  description: '',
  price: '',
  old_price: '',
  category: 'clothing',
  gender: 'women',
  collection: '',
  sizes: 'S, M, L',
  colors: 'black, white',
  image_url: '',
  is_new: false,
  is_sale: false,
  is_active: true,
  images: [],
  variant_group_id: null,
})

const form = ref(emptyForm())

const fetchProducts = async () => {
  loading.value = true
  error.value = ''

  try {
    products.value = await getAdminProducts()
  } catch (err) {
    console.error(err)
    error.value = 'Не удалось загрузить товары. Проверь права доступа в Supabase.'
  } finally {
    loading.value = false
  }
}

const openCreateForm = () => {
  resetImageSelection()
  existingImages.value = []
  editingId.value = null
  form.value = emptyForm()
  showForm.value = true
  error.value = ''
  success.value = ''
  selectedColor.value = 'black'
  selectedVariantGroup.value = ''
  createVariantGroup.value = false
}

const openEditForm = (product) => {
  resetImageSelection()

  existingImages.value = Array.isArray(product.images)
      ? [...product.images]
      : product.image_url
          ? [product.image_url]
          : []
  editingId.value = product.id

  form.value = {
    name: product.name ?? '',
    slug: product.slug ?? '',
    description: product.description ?? '',
    price: product.price ?? '',
    old_price: product.old_price ?? '',
    category: product.category ?? 'clothing',
    gender: product.gender ?? 'women',
    collection: product.collection ?? '',
    sizes: Array.isArray(product.sizes)
        ? product.sizes.join(', ')
        : '',
    colors: Array.isArray(product.colors)
        ? product.colors.join(', ')
        : '',
    image_url: product.image_url ?? '',
    is_new: Boolean(product.is_new),
    is_sale: Boolean(product.is_sale),
    is_active: Boolean(product.is_active),
    images: Array.isArray(product.images)
        ? [...product.images]
        : product.image_url
            ? [product.image_url]
            : [],
    variant_group_id: product.variant_group_id ?? null,
  }

  selectedColor.value = product.colors?.[0] ?? 'black'
  selectedVariantGroup.value = product.variant_group_id ?? ''
  createVariantGroup.value = false
  showForm.value = true
  error.value = ''
  success.value = ''
}

const makeSlug = (value) => {
  return value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-zа-яё0-9-]/gi, '')
      .replace(/-+/g, '-')
}

const splitList = (value) => {
  return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
}

const saveProduct = async () => {
  error.value = ''
  success.value = ''

  if (!form.value.name.trim()) {
    error.value = 'Укажи название товара.'
    return
  }

  if (
      form.value.price === '' ||
      !Number.isFinite(Number(form.value.price)) ||
      Number(form.value.price) < 0
  ) {
    error.value = 'Укажи корректную цену.'
    return
  }

  const slug = form.value.slug.trim() || makeSlug(form.value.name)

  if (!slug) {
    error.value = 'Не удалось сформировать slug. Укажи его вручную.'
    return
  }

  let uploadedImages = []

  try {
    if (selectedImageFiles.value.length) {
      uploadingImage.value = true

      uploadedImages = await Promise.all(
          selectedImageFiles.value.map((file) =>
              uploadProductImage(file)
          )
      )
    }
  } catch (err) {
    console.error('Image upload error:', err)
    error.value = err.message || 'Не удалось загрузить фотографии.'
    return
  } finally {
    uploadingImage.value = false
  }

  const allImages = [
    ...existingImages.value,
    ...uploadedImages,
  ]

  let variantGroupId = selectedVariantGroup.value || null

  if (createVariantGroup.value && !variantGroupId) {
    variantGroupId = crypto.randomUUID()
  }

  if (editingId.value && !variantGroupId && form.value.variant_group_id) {
    variantGroupId = form.value.variant_group_id
  }

  const payload = {
    name: form.value.name.trim(),
    slug,
    description: form.value.description.trim() || null,
    price: Number(form.value.price),
    old_price: form.value.old_price === ''
        ? null
        : Number(form.value.old_price),
    category: form.value.category.trim() || null,
    gender: form.value.gender,
    collection: form.value.collection.trim() || null,
    sizes: splitList(form.value.sizes),
    colors: [selectedColor.value],
    image_url: allImages[0] || null,
    images: allImages,
    variant_group_id: variantGroupId,
    is_new: form.value.is_new,
    is_sale: form.value.is_sale,
    is_active: form.value.is_active,
  }

  if (
      payload.old_price !== null &&
      (!Number.isFinite(payload.old_price) || payload.old_price < 0)
  ) {
    error.value = 'Старая цена указана некорректно.'
    return
  }

  try {
    saving.value = true

    if (editingId.value) {
      await updateProduct(editingId.value, payload)
      success.value = 'Товар успешно обновлён.'
    } else {
      await createProduct(payload)
      success.value = 'Товар успешно добавлен.'
    }

    showForm.value = false
    await fetchProducts()
  } catch (err) {
    console.error('Product save error:', err)
    error.value = err.message || 'Не удалось сохранить товар.'
  } finally {
    saving.value = false
  }
}

function removeProduct(product) {
  productToDelete.value = product
  showDeleteModal.value = true
}

function closeDeleteModal() {
  if (deleting.value) return

  showDeleteModal.value = false
  productToDelete.value = null
}

async function confirmDelete() {
  if (!productToDelete.value || deleting.value) return

  deleting.value = true
  error.value = ''
  success.value = ''

  try {
    const result = await deleteProduct(productToDelete.value.id)

    products.value = products.value.filter(
        product => product.id !== productToDelete.value.id
    )

    success.value = result.cleanupError
        ? result.cleanupError
        : 'Товар и неиспользуемые фотографии успешно удалены.'

    showDeleteModal.value = false
    productToDelete.value = null
  } catch (err) {
    console.error('Ошибка удаления товара:', err)
    error.value = 'Не удалось удалить товар. Попробуйте ещё раз.'
  } finally {
    deleting.value = false
  }
}

onMounted(fetchProducts)

watch(
    [
      searchQuery,
      filterCategory,
      filterGender,
      filterCollection,
      filterStatus,
      sortBy,
    ],
    () => {
      currentPage.value = 1
    }
)

watch(totalPages, (pages) => {
  if (pages === 0) {
    currentPage.value = 1
  } else if (currentPage.value > pages) {
    currentPage.value = pages
  }
})
</script>

<template>
  <main class="min-h-screen bg-gray-50 px-4 py-8 sm:px-8">
    <div class="mx-auto max-w-7xl">
      <RouterLink to="/admin" class="text-sm text-gray-500 hover:text-gray-900">
        ← Панель управления
      </RouterLink>

      <div class="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-semibold text-gray-900">
            Товары
          </h1>
          <p class="mt-2 text-sm text-gray-500">
            Всего: {{ products.length }}
          </p>
        </div>

        <button
            type="button"
            @click="openCreateForm"
            class="rounded-lg bg-gray-900 px-5 py-3 text-sm text-white hover:bg-gray-700">
          + Добавить товар
        </button>
      </div>

      <!-- Search, sort -->
      <div class="mt-6 rounded-xl border border-gray-200 bg-white p-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <!-- Search -->
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700">
              Поиск товара
            </label>

            <input
                v-model="searchQuery"
                type="search"
                placeholder="Название или slug..."
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-gray-900"/>
          </div>

          <!-- Category -->
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700">
              Категория
            </label>

            <select
                v-model="filterCategory"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900">
              <option value="">Все категории</option>

              <option
                  v-for="category in categoryOptions"
                  :key="category.value"
                  :value="category.value">
                {{ category.label }}
              </option>
            </select>
          </div>

          <!-- Gender -->
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700">
              Для кого
            </label>

            <select
                v-model="filterGender"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900">
              <option value="">Все</option>
              <option value="women">Женщинам</option>
              <option value="men">Мужчинам</option>
              <option value="unisex">Унисекс</option>
            </select>
          </div>

          <!-- Collection -->
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700">
              Коллекция
            </label>

            <select
                v-model="filterCollection"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900">
              <option value="">Все коллекции</option>

              <option
                  v-for="collection in collectionOptions"
                  :key="collection.value"
                  :value="collection.value">
                {{ collection.label }}
              </option>
            </select>
          </div>

          <!-- Status -->
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700">
              Статус товара
            </label>

            <select
                v-model="filterStatus"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900">
              <option value="all">Все товары</option>
              <option value="active">Активные</option>
              <option value="hidden">Скрытые</option>
            </select>
          </div>

          <!-- Sort -->
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700">
              Сортировка
            </label>

            <select
                v-model="sortBy"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900">
              <option value="newest">Сначала новые</option>
              <option value="oldest">Сначала старые</option>
              <option value="name-asc">По названию: А–Я</option>
              <option value="name-desc">По названию: Я–А</option>
              <option value="price-asc">Сначала дешёвые</option>
              <option value="price-desc">Сначала дорогие</option>
            </select>
          </div>

        </div>

        <!-- Result filters -->
        <div class="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
          <p class="text-sm text-gray-500">
            Найдено товаров: {{ filteredProducts.length }} из {{ products.length }}
          </p>

          <button
              type="button"
              @click="
                searchQuery = '';
                filterCategory = '';
                filterGender = '';
                filterCollection = '';
                filterStatus = 'all';
                sortBy = 'newest';"
              class="text-sm font-medium text-gray-700 underline underline-offset-4 hover:text-black">
            Сбросить фильтры
          </button>
        </div>
      </div>

      <p v-if="error" class="mt-5 text-sm text-red-600">
        {{ error }}
      </p>

      <p v-if="success" class="mt-3 text-sm text-green-700">
        {{ success }}
      </p>

      <p v-if="loading" class="py-10 text-gray-500">
        Загружаем товары…
      </p>

      <div
          v-else
          class="mt-8 overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table class="w-full min-w-[800px] text-left text-sm">
          <thead class="border-b bg-gray-50 text-gray-500">
          <tr>
            <th class="px-5 py-4 font-medium">Товар</th>
            <th class="px-5 py-4 font-medium">Категория</th>
            <th class="px-5 py-4 font-medium">Цена</th>
            <th class="px-5 py-4 font-medium">Статус</th>
            <th class="px-5 py-4 font-medium">Действия</th>
          </tr>
          </thead>

          <tbody>
          <tr
              v-for="product in paginatedProducts"
              :key="product.id"
              class="border-b last:border-b-0">
            <td class="px-5 py-4">
              <div class="flex items-center gap-3">
                <img
                    v-if="product.image_url"
                    :src="product.image_url"
                    :alt="product.name"
                    class="h-14 w-12 rounded object-cover"/>
                <div>
                  <p class="font-medium text-gray-900">
                    {{ product.name }}
                  </p>
                  <p class="mt-1 text-xs text-gray-500">
                    {{ product.slug }}
                  </p>
                </div>
              </div>
            </td>

            <td class="px-5 py-4 text-gray-600">
              {{ product.category || '—' }}
            </td>

            <td class="whitespace-nowrap px-5 py-4">
              {{ Number(product.price).toLocaleString('ru-RU') }} ₽
            </td>

            <td class="px-5 py-4">
              {{ product.is_active ? 'Активен' : 'Скрыт' }}
            </td>

            <td class="px-5 py-4">
              <div class="flex gap-3">
                <button
                    type="button"
                    @click="openEditForm(product)"
                    class="underline underline-offset-4">
                  Изменить
                </button>

                <button
                    type="button"
                    @click="removeProduct(product)"
                    class="rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 active:bg-red-100">
                  Удалить
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="filteredProducts.length === 0">
            <td colspan="5" class="px-5 py-10 text-center text-gray-500">
              {{ products.length === 0 ? 'Товаров пока нет.' : 'По заданным условиям товары не найдены.' }}
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <div
          v-if="filteredProducts.length > 0"
          class="mt-4 flex flex-wrap items-center justify-between gap-4">
        <p class="text-sm text-gray-500">
          Страница {{ currentPage }} из {{ totalPages }}
        </p>

        <div class="flex items-center gap-2">
          <button
              type="button"
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="rounded-lg border border-gray-300 px-4 py-2 text-sm transition hover:bg-gray-100
              disabled:cursor-not-allowed disabled:opacity-40">
            ← Назад
          </button>

          <button
              v-for="page in totalPages"
              :key="page"
              type="button"
              @click="goToPage(page)"
              :class="['min-w-10 rounded-lg border px-3 py-2 text-sm transition',
              currentPage === page ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-300 hover:bg-gray-100' ]">
            {{ page }}
          </button>

          <button
              type="button"
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="rounded-lg border border-gray-300 px-4 py-2 text-sm transition hover:bg-gray-100
              disabled:cursor-not-allowed disabled:opacity-40">
            Далее →
          </button>
        </div>
      </div>

      <div
          v-if="showForm"
          class="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4"
          @click.self="showForm = false">
        <section class="mx-auto my-6 max-w-2xl rounded-xl bg-white p-6 sm:p-8">
          <div class="mb-6 flex items-center justify-between gap-4">
            <h2 class="text-xl font-semibold">
              {{ editingId ? 'Редактировать товар' : 'Новый товар' }}
            </h2>

            <button
                type="button"
                @click="showForm = false"
                class="text-2xl text-gray-500"
                aria-label="Закрыть">
              ×
            </button>
          </div>

          <form class="space-y-5" @submit.prevent="saveProduct">
            <div>
              <label class="mb-1 block text-sm">Название *</label>
              <input
                  v-model="form.name"
                  required
                  class="w-full rounded-lg border p-3"
                  placeholder="Например, Футболка хлопковая"/>
            </div>

            <div>
              <label class="mb-1 block text-sm">Slug</label>
              <input
                  v-model="form.slug"
                  class="w-full rounded-lg border p-3"
                  placeholder="futbolka-hlopkovaya"/>
              <p class="mt-1 text-xs text-gray-500">
                Используется в адресе товара. Лучше латиницей.
              </p>
            </div>

            <div>
              <label class="mb-1 block text-sm">Описание</label>
              <textarea
                  v-model="form.description"
                  rows="3"
                  class="w-full rounded-lg border p-3"/>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="mb-1 block text-sm">Цена, ₽ *</label>
                <input
                    v-model="form.price"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    class="w-full rounded-lg border p-3"/>
              </div>

              <div>
                <label class="mb-1 block text-sm">Старая цена, ₽</label>
                <input
                    v-model="form.old_price"
                    type="number"
                    min="0"
                    step="0.01"
                    class="w-full rounded-lg border p-3"/>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="mb-2 block text-sm">Категория</label>

                <select
                    v-model="form.category"
                    class="w-full rounded-lg border border-gray-300 px-3 py-2">
                  <option
                      v-for="category in categoryOptions"
                      :key="category.value"
                      :value="category.value">
                    {{ category.label }}
                  </option>
                </select>
              </div>

              <div>
                <label class="mb-1 block text-sm">Пол</label>
                <select
                    v-model="form.gender"
                    class="w-full rounded-lg border p-3">
                  <option value="women">Женский</option>
                  <option value="men">Мужской</option>
                  <option value="unisex">Унисекс</option>
                </select>
              </div>
            </div>

            <div>
              <label class="mb-2 block text-sm">Коллекция</label>

              <select
                  v-model="form.collection"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2">
                <option value="">Без коллекции</option>

                <option
                    v-for="collection in collectionOptions"
                    :key="collection.value"
                    :value="collection.value">
                  {{ collection.label }}
                </option>
              </select>
            </div>

            <div>
              <label class="mb-1 block text-sm">Размеры через запятую</label>
              <input
                  v-model="form.sizes"
                  class="w-full rounded-lg border p-3"
                  placeholder="S, M, L, XL"/>
            </div>

            <div>
              <label class="mb-3 block text-sm font-medium">
                Цвет этого варианта
              </label>

              <div class="flex flex-wrap gap-3">
                <button
                    v-for="color in colorOptions"
                    :key="color.value"
                    type="button"
                    @click="selectedColor = color.value"
                    :aria-label="color.label"
                    :aria-pressed="selectedColor === color.value"
                    class="flex flex-col items-center gap-2 rounded-lg border p-2 transition"
                    :class="selectedColor === color.value
                ? 'border-gray-900 bg-gray-100'
                : 'border-transparent hover:border-gray-300'"
                >
            <span
                class="flex h-9 w-9 items-center justify-center rounded-full border border-black/10"
                :style="{ backgroundColor: color.hex }">
                <span
                    v-if="selectedColor === color.value"
                    :class="['text-lg', color.value === 'black' || color.value === 'blue' || color.value === 'brown' ? 'text-white' : 'text-gray-900']">
                    ✓
                </span>
            </span>

                  <span class="text-xs">
                {{ color.label }}
            </span>
                </button>
              </div>

              <p class="mt-3 text-sm text-gray-500">
                Выбран цвет: {{ selectedColorLabel }}
              </p>
            </div>

            <div class="rounded-xl border border-gray-200 p-4">
              <h3 class="font-medium">Цветовые варианты модели</h3>

              <p class="mt-1 text-sm text-gray-500">
                Выбери существующую модель, если этот товар — другой цвет уже созданного товара.
              </p>

              <label class="mt-4 block text-sm">
                Существующая модель
              </label>

              <select
                  v-model="selectedVariantGroup"
                  class="mt-1 w-full rounded-lg border bg-white p-3"
                  @change="createVariantGroup = false">
                <option value="">Не выбирать</option>

                <option
                    v-for="group in variantGroups"
                    :key="group.id"
                    :value="group.id">
                  {{ group.name }}
                </option>
              </select>

              <label class="mt-4 flex items-center gap-3 text-sm">
                <input
                    v-model="createVariantGroup"
                    type="checkbox"
                    @change="selectedVariantGroup = ''"/>
                Создать новую группу модели
              </label>
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium">
                Фотографии товара
              </label>

              <label
                  class="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed
                  border-gray-300 bg-gray-50 px-5 py-8 text-center transition hover:border-gray-500 hover:bg-gray-100">
                <span class="text-3xl">＋</span>

                <span class="mt-2 font-medium text-gray-800">
                  Выбрать фотографии
                </span>

                <span class="mt-1 text-xs text-gray-500">
                    Можно выбрать несколько файлов, до 5 МБ каждый
                </span>

                <input
                    type="file"
                    accept="image/*"
                    multiple
                    class="sr-only"
                    @change="handleImageChange"/>
              </label>

              <div
                  v-if="existingImages.length || imagePreviews.length"
                  class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div
                    v-for="(url, index) in existingImages"
                    :key="url"
                    class="relative">
                  <img
                      :src="url"
                      alt="Фотография товара"
                      class="h-36 w-full rounded-lg border object-cover"/>

                  <button
                      type="button"
                      @click="removeExistingImage(index)"
                      class="absolute right-2 top-2 rounded-full bg-white px-2 py-1 text-sm shadow"
                      aria-label="Удалить фотографию">
                    ×
                  </button>

                  <span
                      v-if="index === 0"
                      class="mt-1 block text-xs text-gray-500">
                    Главное фото
                  </span>
                </div>

                <div
                    v-for="(url, index) in imagePreviews"
                    :key="url"
                    class="relative">
                  <img
                      :src="url"
                      alt="Новая фотография"
                      class="h-36 w-full rounded-lg border object-cover"/>

                  <button
                      type="button"
                      @click="removeNewImage(index)"
                      class="absolute right-2 top-2 rounded-full bg-white px-2 py-1 text-sm shadow"
                      aria-label="Убрать выбранную фотографию">
                    ×
                  </button>
                </div>
              </div>
            </div>

            <div class="space-y-3">
              <label class="flex items-center gap-3 text-sm">
                <input v-model="form.is_new" type="checkbox" />
                Новинка
              </label>

              <label class="flex items-center gap-3 text-sm">
                <input v-model="form.is_sale" type="checkbox" />
                Распродажа
              </label>

              <label class="flex items-center gap-3 text-sm">
                <input v-model="form.is_active" type="checkbox" />
                Показывать в магазине
              </label>
            </div>

            <p v-if="error" class="text-sm text-red-600">
              {{ error }}
            </p>

            <div class="flex flex-wrap justify-end gap-3 pt-3">
              <button
                  type="button"
                  @click="showForm = false"
                  class="rounded-lg border px-5 py-3">
                Отмена
              </button>

              <button
                  type="submit"
                  :disabled="saving || uploadingImage"
                  class="rounded-lg bg-gray-900 px-5 py-3 text-white disabled:opacity-50">
                {{ uploadingImage ? 'Загружаем фото…' : saving ? 'Сохраняем…' : 'Сохранить товар' }}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  </main>

  <AdminDeleteModal
      :show="showDeleteModal"
      :item-name="productToDelete?.name ?? ''"
      :loading="deleting"
      :error="error"
      @close="closeDeleteModal"
      @confirm="confirmDelete"
  />
</template>
